# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
from functools import wraps
from quart import Quart, request, jsonify, json
from quart_cors import cors
from transformers import AutoTokenizer, AutoModelForCausalLM


class ModelHF:
    def __init__(self, model_name_or_path, cache_dir=None):
        self.tokenizer = AutoTokenizer.from_pretrained(
            model_name_or_path, cache_dir=cache_dir + "/token"
        )
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name_or_path, cache_dir=cache_dir + "/model"
        )


app = Quart(__name__)
#! HTF - enable `x-www-form-urlencoded` ContentType requests ??
cors(app)

global active_model
active_model_name = "meta-llama/Llama-2-7b-hf"
active_model = ModelHF(active_model_name, "/LLMs-Flask/models/" + active_model_name)


async def on_model_set(name=""):
    active_model_name = name
    active_model = await ModelHF(
        active_model_name, "/LLMs-Flask/models/" + active_model_name
    )


#! ROUTES - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


@app.route("/", methods=["GET"])
async def test_front():
    return "<h1>Python LlamaV2 Hello!<h1>"


# async def prompt_extraction_middleware(view_func):
#     @wraps(view_func)
#     async def wrapper(*args, **kwargs):
#         print(
#             "REQUESTING ----------------------------------------------------------------------"
#         )
#         mimetype = request.mimetype
#         if mimetype == "application/x-www-form-urlencoded":
#             data = await request.form
#         elif mimetype == "multipart/form-data":
#             data = await dict(request.form)
#         elif mimetype == "application/json":
#             data = await request.json
#         else:
#             data = (await request.data).decode()

#         print(mimetype, data, type(data))

#         kwargs["prompt"] = data["prompt"]

#         return view_func(*args, **kwargs)

#     return wrapper


# async def select_active_model(view_func):
#     @wraps(view_func)
#     async def wrapper(*args, **kwargs):
#         requested_model_name = request.args.get("model")

#         if requested_model_name != active_model_name:
#             await on_model_set(requested_model_name)

#         return view_func(*args, **kwargs)

#     return wrapper


@app.route("/gen", methods=["POST"])
async def generate():
    input_data = await request.get_json()
    prompt = input_data.get("prompt")
    input_text = prompt
    inputs = active_model.tokenizer.encode(input_text, return_tensors="pt")
    outputs = active_model.model.generate(
        inputs, max_length=50, num_return_sequences=1, temperature=0.7
    )
    response_text = active_model.tokenizer.decode(outputs[0])
    return jsonify({"response": response_text}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0")
