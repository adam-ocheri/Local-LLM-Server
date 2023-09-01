# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
from quart import Quart, request, jsonify, json, g
from quart_cors import cors
import pandas as pd
import io
import torch
from datasets import Dataset
from model_hf import ModelHF
import asyncio

# from dotenv import load_dotenv

# load_dotenv()
# import os

# cuda_version = os.getenv("BNB_CUDA_VERSION")
# ld_lib_path = os.getenv("LD_LIBRARY_PATH")

# print("Database URL:", cuda_version)
# print("API Key:", ld_lib_path)

torch.cuda.empty_cache()

#! INITIALIZATIONS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app = Quart(__name__)
cors(app)
print("ML Server starting...")


active_model_name = "meta-llama/Llama-2-7b-hf"


# Define an asynchronous function to create the active_model
async def init_model():
    return await ModelHF.create(
        active_model_name, "./LLMs-Endpoint/models/" + active_model_name
    )


# Define a lambda that calls the asynchronous function
set_active_model = lambda: asyncio.run(init_model())

# Uncomment this line to immediately load model once the app runs:
# app.active_model: ModelHF = set_active_model()


async def on_model_set(name=""):
    active_model_name = name
    app.active_model = await ModelHF.create(
        active_model_name, "./LLMs-Endpoint/models/" + active_model_name
    )
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
    input_data = await request.get_json()
    prompt = input_data.get("prompt")
    input_text = prompt
    inputs = app.active_model.tokenizer.encode(input_text, return_tensors="pt")
    outputs = app.active_model.model.generate(
        inputs, max_length=50, num_return_sequences=1, temperature=0.7
    )
    response_text = app.active_model.tokenizer.decode(outputs[0])
    return jsonify({"response": response_text}), 200


@app.route("/reload", methods=["POST"])
async def reload():
    print("request received to update Active Model")
    in_model_name = request.args.get("model")
    response = await on_model_set(in_model_name)
    return response


@app.route("/fine-tune", methods=["POST"])
async def process_csv():
    print("Got CSV Request! Processing...")

    # csv_data = await request.get_data()
    # csv_data_str = csv_data.decode("utf-8")
    csv_data = await request.get_json()
    print("csv from json: ", csv_data)
    csv_data_str = csv_data.get("csvData")
    print("csv data: ", csv_data_str)
    # Convert CSV data to Pandas DataFrame
    # TODO Process the DataFrame as needed - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    df = pd.read_csv(io.StringIO(csv_data_str))
    df = df.fillna("")
    df.to_csv("./LLMs-Endpoint/app/train.csv", index=False)

    # training - - - - - - - - - - - - - -
    dataset = Dataset.from_pandas(df)
    train = await app.active_model.pre_train(dataset=dataset)
    # train = await active_model.train(dataset, output_dir="./LLMs-Endpoint/models")
    # if train == "training complete":
    return jsonify({"response": "CSV data received and processed.\n" + train}), 200

    # TODO Return the data back - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


if __name__ == "__main__":
    app.run(host="0.0.0.0")
