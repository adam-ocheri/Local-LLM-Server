# Local LLM Server

## Description

This project utilizes Docker containers to setup the HuggingFace API and a Flask/Quart server, serving HuggingFace large language models through a Node backend via a React/Next.js frontend.
The default model used is the Meta LlamaV2 7-Billion parameters model.
A desired model name is passed via the `Request Params` of the HTTP request, and is consistent with the HuggingFace model naming convention, like the default `meta-llama/Llama-2-7b-hf` model name.
For more info, visit https://huggingface.co/models

## Specs

To leverage the large cache size of the LLMs, these are kept as a Volume for the docker container.
This means, that with each time the image is built and run the cache files would be downloaded afresh. For development, cache is downloaded once and will be stored in the `./LLMs-Endpoint/models` directory after files are finished downloading.

- Min. installed Docker image size: 6.8 GB (after installing all dependencies)
- Min. default container size: 19.8 GB (after the container loaded up and finished downloading the default `Llama-7b` model ; This can be changed by the user)

## Prerequisites

Before using this project, a basic credentials setup is needed:

- **Create a HuggingFace account, with granted access to the LlamaV2 models** - https://huggingface.co/blog/llama2
- **Generate a private User Access Token from HuggingFace** - https://huggingface.co/docs/hub/security-tokens
- **Install the `huggingface-hub` python package to authorize your token with the `huggingface-cli`** - https://huggingface.co/docs/huggingface_hub/quick-start

## Install

Before installing the dependencies for the 3 apps, make sure that your system has the required runtime environments installed:

- Python >= 3.10
- Node.js >= 16.17.0

Once these requirements are met, you can proceed to installing the dependencies for the 3 services. It's best to do this on a separate python environment.
Then run the following commands:

1. **UI Frontend** - `cd UIFrontend && npm install`
2. **Node Backend** - `cd BackendAPI-Node && npm install`
3. **Py LLM Server** - `cd LLMs-Endpoint/app && pip install --no-cache-dir -r requirements.txt && pip install bitsandbytes==<version> --prefer-binary --extra-index-url=https://jllllll.github.io/bitsandbytes-windows-webui && pip3 install torch --index-url https://download.pytorch.org/whl/cu117`

### Development

After installing all required dependencies, you can open 3 terminals through which each app would execute.
As this project will mature over time, both the installation and run processes would be automated into simple commands.
Run the following commands to start development:

1. **UI Frontend** - `cd UIFrontend && npm run dev`
2. **Node Backend** - `cd BackendAPI-Node && npm run start`
3. **Py LLM Server** - `cd LLMs-Endpoint/app && python app.py`

### Production Setup

The 3 services are bundled together into a container cluster using Docker Compose.
This makes it easier to later deploy the entire app as a whole to any cloud provider of choice.

To build and run the container locally, you first need to have Docker Engine installed on your system - https://docs.docker.com/engine/install/
Then, make sure you put your HuggingFace token in the `.env` file under the `/LLMs-Endpoint` directory. This is crucial for you to be able to connect to HuggingFace and download the models within the docker environment.

Once Docker is installed, the app can simply be built using the command `docker-compose up`
To remove the containers and stop the app, use `docker-compose down`.

## Usage

- Load any LlamaV2 model (or any other LLM from HF)
- Make inferences from a browser-based UI
- Easily Use custom data to fine-tune and further train your models

**UPCOMING FEATURES**

- train/test sets split
- Post-training evaluation and benchmarking
- More info output in the UI during training

## Troubleshooting

If you are attempting to connect to HuggingFace or trying to download a model but facing errors, please first check this link to see the status of all HF online services: https://status.huggingface.co/

If you are facing errors when building the docker containers, try increasing the max image size in the docker engine settings. The LLM server takes up a lot of disk memory to download and install the dependencies for all the required packages.
Once that's done, try running `docker-compose build --no-cache`.

For any other issues you may face, please submit an Issue in this repository and provide details of your environment and hardware setup, as well as any code related area of concern +/ console logs.

Happy coding!
