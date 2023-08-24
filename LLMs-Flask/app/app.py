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
# cors(app)

global active_model
active_model_name = "meta-llama/Llama-2-7b-hf"
active_model = ModelHF(active_model_name, "/LLMs-Flask/models/" + active_model_name)


async def on_model_set(name=""):
    active_model_name = name
    active_model = await ModelHF(
        active_model_name, "/LLMs-Flask/models/" + active_model_name
    )


#! ROUTES - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


@app.after_request
async def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:4000"
    response.headers[
        "Access-Control-Allow-Methods"
    ] = "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    response.headers[
        "Access-Control-Allow-Headers"
    ] = "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


@app.route("/", methods=["GET"])
async def test_front():
    return "<h1> HuggingFace AI Container Endpoint - ~!!!hElLoWOrLd!!!~ <h1>"


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
    app.run()
