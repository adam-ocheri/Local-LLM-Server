# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
from quart import Quart, request, jsonify, json, g
from quart_cors import cors
import pandas as pd
import io
import os
import torch
from datasets import Dataset, load_dataset
import asyncio
from model_hf import ModelHF
from finetune import merge_dir

#! INITIALIZATIONS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
torch.cuda.empty_cache()
trained_models_exist = os.access(merge_dir, 0)
print("trained_models_exist?: ", trained_models_exist)

if trained_models_exist:
    trained_model_dirs = os.listdir(merge_dir)
    print("trained_model_dirs: ", trained_model_dirs)


app = Quart(__name__)
cors(app)
print("ML Server starting...")


active_model_name = "meta-llama/Llama-2-7b-hf"
cache_dir_path = "./LLMs-Endpoint/models/" + active_model_name
trained_model_path = merge_dir + "/" + active_model_name
model_path = cache_dir_path


# Define an asynchronous function to create the active_model
async def init_model():
    return await ModelHF.create(active_model_name, model_path)


# Define a lambda that calls the asynchronous function
set_active_model = lambda: asyncio.run(init_model())

# Uncomment this line to immediately load model once the app runs:
app.active_model: ModelHF = set_active_model()


async def on_model_set(name=""):
    active_model_name = name
    app.active_model = await ModelHF.create(active_model_name, model_path)
    return jsonify({"ModelUpdated": active_model_name}), 200


#! ROUTES - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


@app.after_request
async def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://127.0.0.1:4000"
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
    # Extract data from request
    input_data = await request.get_json()
    temp = input_data.get("temperature")
    beams = input_data.get("numBeams")
    max_answer_length = input_data.get("maxLength")
    prompt = input_data.get("prompt")

    # Validate request string length is not longer than the number of the "num_returned_sequences"
    if len(prompt) >= max_answer_length:
        max_answer_length = len(prompt) * 2

    # Generate and perform the inference
    input_text = prompt
    input_ids = (
        torch.tensor(app.active_model.tokenizer.encode(input_text)).unsqueeze(0).cuda()
    )
    inputs = app.active_model.tokenizer.encode(input_text, return_tensors="pt")
    outputs = app.active_model.model.generate(
        # inputs,
        input_ids=input_ids,
        temperature=temp,
        max_length=max_answer_length,
        num_return_sequences=1,
        num_beams=beams,
    )

    # Return the answer
    if len(outputs) == 1:
        response_text = app.active_model.tokenizer.decode(outputs[0])
        return jsonify({"response": response_text}), 200
    else:
        output_array = []
        for i in range(0, len(outputs)):
            output_array.append(app.active_model.tokenizer.decode(outputs[i]))
        # response_text = app.active_model.tokenizer.decode(outputs)
        return jsonify({"response": output_array}), 200


@app.route("/reload", methods=["POST"])
async def reload():
    print("request received to update Active Model")
    in_model_name = request.args.get("model")
    response = await on_model_set(in_model_name)
    return response


@app.route("/fine-tune", methods=["GET"])
async def verify_dataset():
    print("Verifying dataset before training begins...")
    dataset_valid = False
    if app.active_model.dataset != None:
        dataset_valid = True
    return jsonify({"datasetValid": dataset_valid}), 200


@app.route("/fine-tune", methods=["POST"])
async def process_csv():
    print("Got CSV Request! Processing...")

    csv_data = await request.get_json()
    csv_data_str = csv_data.get("csvData")

    df = pd.read_csv(io.StringIO(csv_data_str))
    df = df.fillna("")
    df.to_csv("./LLMs-Endpoint/app/train.csv", index=False)
    dataset = Dataset.from_pandas(df)

    pre_train = await app.active_model.pre_train(dataset=dataset)
    return jsonify({"response": pre_train}), 200


@app.route("/train", methods=["POST"])
async def start_training():
    input_data = await request.get_json()
    training_data = input_data.get("trainingData")
    print("Received training hyper-parameters", training_data)
    model_training = app.active_model.finetune_train
    train = await model_training(training_data)
    return jsonify({"response": "Training Completed!\n" + train}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0")
