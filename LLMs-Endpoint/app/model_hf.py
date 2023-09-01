# ! Imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import os
from random import randrange
from functools import partial
import torch
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    HfArgumentParser,
    Trainer,
    TrainingArguments,
    DataCollatorForLanguageModeling,
    EarlyStoppingCallback,
    pipeline,
    logging,
    set_seed,
)

from transformers.utils import bitsandbytes as bnb

from peft import (
    LoraConfig,
    get_peft_model,
    prepare_model_for_kbit_training,
    PeftModel,
    AutoPeftModelForCausalLM,
)
from trl import SFTTrainer

# ! Definitions - Global Functions - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


def create_bnb_config(
    load_in_4bit, bnb_4bit_use_double_quant, bnb_4bit_quant_type, bnb_4bit_compute_dtype
):
    """
    Configures model quantization method using bitsandbytes to speed up training and inference

    :param load_in_4bit: Load model in 4-bit precision mode
    :param bnb_4bit_use_double_quant: Nested quantization for 4-bit model
    :param bnb_4bit_quant_type: Quantization data type for 4-bit model
    :param bnb_4bit_compute_dtype: Computation data type for 4-bit model
    """

    bnb_config = BitsAndBytesConfig(
        load_in_4bit=load_in_4bit,
        bnb_4bit_use_double_quant=bnb_4bit_use_double_quant,
        bnb_4bit_quant_type=bnb_4bit_quant_type,
        bnb_4bit_compute_dtype=bnb_4bit_compute_dtype,
    )

    return bnb_config


async def load_model(model_name, cache_dir, bnb_config):
    """
    Loads model and model tokenizer

    :param model_name: Hugging Face model name
    :param bnb_config: Bitsandbytes configuration
    """

    # Get number of GPU device and set maximum memory
    n_gpus = torch.cuda.device_count()
    max_memory = f"{40960}MB"

    # Load model
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        quantization_config=bnb_config,
        cache_dir=cache_dir + "/model",
        device_map="auto",  # dispatch the model efficiently on the available resources
        max_memory={i: max_memory for i in range(n_gpus)},
    )

    # Load model tokenizer with the user authentication token
    tokenizer = AutoTokenizer.from_pretrained(
        model_name, cache_dir=cache_dir + "/token", use_auth_token=True
    )

    # Set padding token as EOS token
    tokenizer.pad_token = tokenizer.eos_token

    return model, tokenizer


def preprocess_batch(batch, tokenizer, max_length):
    """
    Tokenizes dataset batch

    :param batch: Dataset batch
    :param tokenizer: Model tokenizer
    :param max_length: Maximum number of tokens to emit from the tokenizer
    """

    return tokenizer(
        batch["text"],
        max_length=max_length,
        truncation=True,
    )


def create_prompt_formats(sample):
    """
    Creates a formatted prompt template for a prompt in the instruction dataset

    :param sample: Prompt or sample from the instruction dataset
    """

    # Initialize static strings for the prompt template
    INTRO_BLURB = "Below is an instruction that describes a task. Write a response that appropriately completes the request."
    INSTRUCTION_KEY = "### Instruction:"
    INPUT_KEY = "Input:"
    RESPONSE_KEY = "### Response:"
    END_KEY = "### End"

    # Combine a prompt with the static strings
    blurb = f"{INTRO_BLURB}"
    instruction = f"{INSTRUCTION_KEY}\n{sample['instruction']}"
    input_context = f"{INPUT_KEY}\n{sample['input']}" if sample["input"] else None
    response = f"{RESPONSE_KEY}\n{sample['output']}"
    end = f"{END_KEY}"

    # Create a list of prompt template elements
    parts = [
        part for part in [blurb, instruction, input_context, response, end] if part
    ]

    # Join prompt template elements into a single string to create the prompt template
    formatted_prompt = "\n\n".join(parts)

    # Store the formatted prompt template in a new key "text"
    sample["text"] = formatted_prompt

    return sample


# ! Definitions - Data Structures - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


class ModelHF:
    def __init__(self, model, tokenizer):
        self.tokenizer = tokenizer
        self.model = model
        self.dataset = None

    @classmethod
    async def create(cls, model_name_or_path, cache_dir=None):
        print("creating Model...", model_name_or_path)
        # ! Avoiding 4bit quantization due to using v0.37.5 (min version for hf transformers' BitsAndBytesConfig needs >==0.39.0)
        load_in_4bit = False
        # ? Activate nested quantization for 4-bit base models (double quantization)
        bnb_4bit_use_double_quant = False

        # ? Quantization type (fp4 or nf4)
        bnb_4bit_quant_type = "fp4"

        # ? Compute data type for 4-bit base models
        bnb_4bit_compute_dtype = torch.bfloat16

        # Create bnb config and load the model
        # You can perform any asynchronous setup or initialization here if needed before returning the instance
        bnb_config = create_bnb_config(
            load_in_4bit,
            bnb_4bit_use_double_quant,
            bnb_4bit_quant_type,
            bnb_4bit_compute_dtype,
        )
        model, tokenizer = await load_model(model_name_or_path, cache_dir, bnb_config)
        instance = cls(model, tokenizer)

        return instance

    def process_dataset(self):
        # The instruction dataset to use
        dataset_name = "./LLMs-Endpoint/app/train.csv"

        # Load dataset
        self.dataset = load_dataset("csv", data_files=dataset_name)

        print(f"Number of prompts: {len(self.dataset)}")
        print(f"Column names are: {self.dataset.column_names}")

    def get_max_length(self):
        """
        Extracts maximum token length from the model configuration

        :param model: Hugging Face model
        """

        # Pull model configuration
        conf = self.model.config
        # Initialize a "max_length" variable to store maximum sequence length as null
        max_length = None
        # Find maximum sequence length in the model configuration and save it in "max_length" if found
        for length_setting in ["n_positions", "max_position_embeddings", "seq_length"]:
            max_length = getattr(self.model.config, length_setting, None)
            if max_length:
                print(f"Found max lenth: {max_length}")
                break
        # Set "max_length" to 1024 (default value) if maximum sequence length is not found in the model configuration
        if not max_length:
            max_length = 1024
            print(f"Using default max length: {max_length}")
        return max_length

    def preprocess_dataset(
        self, tokenizer: AutoTokenizer, max_length: int, seed, dataset
    ):
        """
        Tokenizes dataset for fine-tuning

        :param tokenizer (AutoTokenizer): Model tokenizer
        :param max_length (int): Maximum number of tokens to emit from the tokenizer
        :param seed: Random seed for reproducibility
        :param dataset (str): Instruction dataset
        """

        # Add prompt to each sample
        print("Preprocessing dataset...")
        dataset = dataset.map(create_prompt_formats)

        # Apply preprocessing to each batch of the dataset & and remove "instruction", "input", "output", and "text" fields
        _preprocessing_function = partial(
            preprocess_batch, max_length=max_length, tokenizer=self.tokenizer
        )
        dataset = dataset.map(
            _preprocessing_function,
            batched=True,
            remove_columns=["instruction", "input", "output", "text"],
            # cache=False
        )

        # Filter out samples that have "input_ids" exceeding "max_length"
        dataset = dataset.filter(lambda sample: len(sample["input_ids"]) < max_length)

        # Shuffle dataset
        dataset = dataset.shuffle(seed=seed)

        return dataset

    async def pre_train(self, dataset=None):
        seed = 42
        max_length = self.get_max_length()
        print(
            "About to preprocess dataset. This may take a while... (the dataset's size contributes to the load time of course)"
        )
        print(dataset)
        preprocessed_dataset = self.preprocess_dataset(
            self.tokenizer, max_length, seed, dataset
        )
        self.dataset = preprocessed_dataset
        return "Training finished with success"
        print(preprocessed_dataset)

        print(preprocessed_dataset[0])
