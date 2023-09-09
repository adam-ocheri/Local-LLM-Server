import os
import torch
from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    Trainer,
    TrainingArguments,
    DataCollatorForLanguageModeling,
    EarlyStoppingCallback,
    pipeline,
    logging,
    set_seed,
)

import bitsandbytes as bnb

from peft import (
    LoraConfig,
    get_peft_model,
    prepare_model_for_kbit_training,
    PeftModel,
    AutoPeftModelForCausalLM,
)
from trl import SFTTrainer

# Output directory where the model predictions and checkpoints will be stored
output_dir = "./LLMs-Endpoint/finetune-results"
merge_dir = "./LLMs-Endpoint/trained-model"


class DataFormatter:
    def __init__(self, tokenizer: AutoTokenizer):
        self.tokenizer = tokenizer

    def format_data_for_sft(self, example):
        # Tokenize the input text and target text
        print("example is:", example)
        inputs = self.tokenizer(
            example["input_ids"],
            padding="max_length",
            truncation=True,
            return_tensors="pt",
        )
        labels = self.tokenizer(
            example["input_ids"],
            padding="max_length",
            truncation=True,
            return_tensors="pt",
        )

        # Combine inputs and labels into a single dictionary
        formatted_data = {
            "input_ids": inputs["input_ids"],
            "attention_mask": inputs["attention_mask"],
            "labels": labels[
                "input_ids"
            ],  # For text generation, labels are the same as input_ids
        }

        return formatted_data


def create_peft_config(r, lora_alpha, lora_dropout, bias, task_type):
    """
    Creates Parameter-Efficient Fine-Tuning configuration for the model

    :param r: LoRA attention dimension
    :param lora_alpha: Alpha parameter for LoRA scaling
    :param modules: Names of the modules to apply LoRA to
    :param lora_dropout: Dropout Probability for LoRA layers
    :param bias: Specifies if the bias parameters should be trained
    """
    config = LoraConfig(
        r=r,
        lora_alpha=lora_alpha,
        lora_dropout=lora_dropout,
        bias=bias,
        task_type=task_type,
    )

    return config


def find_all_linear_names(model):
    # Find modules to apply LoRA to.

    cls = bnb.nn.Linear4bit
    lora_module_names = set()
    for name, module in model.named_modules():
        if isinstance(module, cls):
            names = name.split(".")
            lora_module_names.add(names[0] if len(names) == 1 else names[-1])

    if "lm_head" in lora_module_names:
        lora_module_names.remove("lm_head")
    print(f"LoRA module names: {list(lora_module_names)}")
    return list(lora_module_names)


def print_trainable_parameters(model, use_4bit=False):
    # Prints the number of trainable parameters in the model.

    trainable_params = 0
    all_param = 0

    for _, param in model.named_parameters():
        num_params = param.numel()
        if num_params == 0 and hasattr(param, "ds_numel"):
            num_params = param.ds_numel
        all_param += num_params
        if param.requires_grad:
            trainable_params += num_params

    if use_4bit:
        trainable_params /= 2

    print(
        f"All Parameters: {all_param:,d} || Trainable Parameters: {trainable_params:,d} || Trainable Parameters %: {100 * trainable_params / all_param}"
    )


async def fine_tune(
    model,
    tokenizer,
    dataset,
    lora_r,
    lora_alpha,
    lora_dropout,
    bias,
    task_type,
    per_device_train_batch_size,
    gradient_accumulation_steps,
    warmup_steps,
    max_steps,
    learning_rate,
    fp16,
    logging_steps,
    output_dir,
    optim,
):
    # Enable gradient checkpointing to reduce memory usage during fine-tuning
    model.gradient_checkpointing_enable()

    # Prepare the model for training
    model = prepare_model_for_kbit_training(model)

    # Get LoRA module names
    # target_modules = find_all_linear_names(model)

    # Create PEFT configuration for these modules and wrap the model to PEFT
    peft_config = create_peft_config(lora_r, lora_alpha, lora_dropout, bias, task_type)
    model = get_peft_model(model, peft_config)

    # Print information about the percentage of trainable parameters
    print_trainable_parameters(model)

    # Training parameters
    trainer = Trainer(
        model=model,
        train_dataset=dataset["input_ids"],
        # packing=True,
        # formatting_func=formatter_func,
        args=TrainingArguments(
            per_device_train_batch_size=per_device_train_batch_size,
            gradient_accumulation_steps=gradient_accumulation_steps,
            warmup_steps=warmup_steps,
            max_steps=max_steps,
            learning_rate=learning_rate,
            fp16=fp16,
            logging_steps=logging_steps,
            output_dir=output_dir,
            optim=optim,
        ),
        data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False),
    )

    model.config.use_cache = False

    do_train = True

    # Launch training and log metrics
    print("Training...")

    if do_train:
        train_result = trainer.train()
        metrics = train_result.metrics
        trainer.log_metrics("train", metrics)
        trainer.save_metrics("train", metrics)
        trainer.save_state()
        print(metrics)

    # Save model
    print("Saving last checkpoint of the model...")
    os.makedirs(output_dir, exist_ok=True)
    trainer.model.save_pretrained(output_dir)

    # Free memory for merging weights
    del model
    del trainer
    torch.cuda.empty_cache()
    return "Training has completed!"


async def init_finetuning(model, tokenizer, preprocessed_dataset, training_data):
    ################################################################################
    # QLoRA parameters
    ################################################################################

    # LoRA attention dimension
    lora_r = training_data.get("matricesUpdateRank")

    # Alpha parameter for LoRA scaling
    lora_alpha = training_data.get("scalingFactor")

    # Dropout probability for LoRA layers
    lora_dropout = training_data.get("dropoutProbability")

    # Bias
    bias = training_data.get("bias")

    # Task type
    task_type = training_data.get("taskType")

    ################################################################################
    # TrainingArguments parameters
    ################################################################################

    # Batch size per GPU for training
    per_device_train_batch_size = training_data.get("perDeviceTrainBatchSize")

    # Number of update steps to accumulate the gradients for
    gradient_accumulation_steps = training_data.get("gradientAccumulationSteps")

    # Initial learning rate (AdamW optimizer)
    learning_rate = training_data.get("learningRate")

    # Optimizer to use
    optim = "paged_adamw_32bit"

    # Number of training steps (overrides num_train_epochs)
    max_steps = training_data.get("maxSteps")

    # Linear warmup steps from 0 to learning_rate
    warmup_steps = training_data.get("warmupSteps")

    # Enable fp16/bf16 training (set bf16 to True with an A100)
    fp16 = True

    # Log every X updates steps
    logging_steps = 1

    result = await fine_tune(
        model,
        tokenizer,
        preprocessed_dataset,
        lora_r,
        lora_alpha,
        lora_dropout,
        bias,
        task_type,
        per_device_train_batch_size,
        gradient_accumulation_steps,
        warmup_steps,
        max_steps,
        learning_rate,
        fp16,
        logging_steps,
        output_dir,
        optim,
    )

    return result


async def merge_weights(model, model_name, training_data):
    # Load fine-tuned weights
    print("\nLoading fine-tuned weights...")
    model = AutoPeftModelForCausalLM.from_pretrained(
        output_dir,
        torch_dtype=torch.bfloat16,  # add `device_map="auto"` if facing OOM issues
    )

    # Merge the LoRA layers with the base model
    print("\nMerging the LoRA layers with the base model")
    model = model.merge_and_unload()

    # Save fine-tuned model at a new location
    print("\nSaving fine-tuned model at a new location")
    os.makedirs(merge_dir, exist_ok=True)
    model.save_pretrained(merge_dir, safe_serialization=True)

    # Save tokenizer for easy inference
    print("\nSaving tokenizer for easy inference")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    tokenizer.save_pretrained(merge_dir)

    print("Fine-tune training completed with success!")
    # upload to hub
    push_to_hub = training_data.get("pushToHub")
    if push_to_hub:
        hf_username = training_data.get("hfUsername")
        new_model_dir = training_data.get("newModelDir")

    return "Merging Weights completed"
