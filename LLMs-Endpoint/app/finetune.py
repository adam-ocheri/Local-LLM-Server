from transformers import Trainer, TrainingArguments
from tqdm.auto import tqdm


class CustomTrainer(Trainer):
    def _training_step(self, model, inputs, optimizer, scheduler):
        print("TRAIN PROGRESS CLOG - Started")
        print("Model.Train()")
        model.train()
        with tqdm(total=len(self.train_dataloader), desc="Training") as pbar:
            for step, batch in enumerate(self.train_dataloader):
                outputs = model(**batch)
                loss = outputs.loss
                loss.backward()

                optimizer.step()
                scheduler.step()
                optimizer.zero_grad()
                pbar.update(1)
                print("TRAIN PROGRESS CLOG - +1")
                pbar.set_postfix({"loss": loss.item()})


# training_args = TrainingArguments(output_dir='./models')
# trainer = CustomTrainer(model=active_model.model, args=training_args, train_dataset=dataset)
# trainer.train()
