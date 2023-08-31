from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments,
)
from finetune import CustomTrainer


class ModelHF:
    def __init__(self, model_name_or_path, cache_dir=None):
        self.tokenizer = AutoTokenizer.from_pretrained(
            model_name_or_path, cache_dir=cache_dir + "/token"
        )
        self.model = AutoModelForSequenceClassification.from_pretrained(
            model_name_or_path, cache_dir=cache_dir + "/model"
        )

    @classmethod
    async def create(cls, model_name_or_path, cache_dir=None):
        instance = cls(model_name_or_path, cache_dir)
        # You can perform any asynchronous setup or initialization here
        # if needed before returning the instance
        return instance

    # @classmethod
    async def train(
        self,
        train_dataset,
        output_dir,
        num_train_epochs=3,
        per_device_train_batch_size=16,
    ):
        training_args = TrainingArguments(
            output_dir=output_dir,
            num_train_epochs=num_train_epochs,
            per_device_train_batch_size=per_device_train_batch_size,
        )
        trainer = CustomTrainer(
            model=self.model,
            args=training_args,
            train_dataset=train_dataset,
            tokenizer=self.tokenizer,
        )

        trainer.train()

        return "training completed"
