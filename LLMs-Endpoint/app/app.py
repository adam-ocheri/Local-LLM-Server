# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
from quart import Quart, request, jsonify, json
from quart_cors import cors
import pandas as pd
import io
import torch
from model_hf import ModelHF
from datasets import Dataset

torch.cuda.empty_cache()

app = Quart(__name__)
cors(app)
print("ML Server starting...")

global active_model
active_model_name = "meta-llama/Llama-2-7b-hf"
active_model = ModelHF(active_model_name, "./LLMs-Endpoint/models/" + active_model_name)


async def on_model_set(name=""):
    active_model_name = name
    active_model = await ModelHF.create(
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
    inputs = active_model.tokenizer.encode(input_text, return_tensors="pt")
    outputs = active_model.model.generate(
        inputs, max_length=50, num_return_sequences=1, temperature=0.7
    )
    response_text = active_model.tokenizer.decode(outputs[0])
    return jsonify({"response": response_text}), 200


@app.route("/reload", methods=["POST"])
async def reload():
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
    df = pd.read_csv(io.StringIO(csv_data_str))
    df = df.fillna("")
    # TODO Process the DataFrame as needed - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    text_col = []
    for _, row in df.iterrows():
        prompt = ""
        instruction = str(row["instruction"])
        input_q = str(row["input"])
        output_q = str(row["output"])

        if len(input_q.strip()) == 0:
            text = (
                prompt
                + "\n### Instruction: "
                + instruction
                + "\n### Expected Output: "
                + output_q
            )
        else:
            text = (
                prompt
                + "\n### Instruction: "
                + instruction
                + "\n### Input: "
                + input_q
                + "\n### Expected Output: "
                + output_q
            )

        text_col.append(text)
        print(df.head())

    df.loc[:, "text"] = text_col
    df.to_csv("./LLMs-Endpoint/app/train.csv", index=False)

    # training - - - - - - - - - - - - - -
    dataset = Dataset.from_pandas(df)
    train = await active_model.train(dataset, output_dir="./LLMs-Endpoint/models")
    if train == "training complete":
        return jsonify({"response": "CSV data received and processed."}), 200

    # TODO Return the data back - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


if __name__ == "__main__":
    app.run(host="0.0.0.0")
