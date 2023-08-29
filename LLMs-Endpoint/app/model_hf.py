from transformers import AutoTokenizer, AutoModelForCausalLM


class ModelHF:
    def __init__(self, model_name_or_path, cache_dir=None):
        self.tokenizer = AutoTokenizer.from_pretrained(
            model_name_or_path, cache_dir=cache_dir + "/token"
        )
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name_or_path, cache_dir=cache_dir + "/model"
        )

    @classmethod
    async def create(cls, model_name_or_path, cache_dir=None):
        instance = cls(model_name_or_path, cache_dir)
        # You can perform any asynchronous setup or initialization here
        # if needed before returning the instance
        return instance
