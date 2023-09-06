# Local LLM Server

## Description

This project utilizes Docker containers to setup the HuggingFace API and a Flask/Quart server, serving HuggingFace large language models through a Node backend via a React/Next.js frontend.
The default model used is the Meta LlamaV2 7-Billion parameters model.
A desired model name is passed via the `Request Params` of the HTTP request, and is consistent with the HuggingFace model naming convention, like the default `meta-llama/Llama-2-7b-hf` model name.
For more info, visit https://huggingface.co/models

## Specs

To leverage the large cache size of the LLMs, these are kept as a Volume for the docker container.
This means, that with each time the image is built and run the cache files would be downloaded afresh. For development, cache is downloaded once and will be stored in the `./LLMs-Flask/models` directory after files are finished downloading.

- Min. installed Docker image size: 6.8 GB (after installing all dependencies)
- Min. default container size: 19.8 GB (after the container loaded up and finished downloading the default `Llama-7b` model ; This can be changed by the user)

## Prerequisites

Before using this project, a basic credentials setup is needed:

- **Create a HuggingFace account, with granted access to the LlamaV2 models** - https://huggingface.co/blog/llama2
- **Generate a private User Access Token from HuggingFace** - https://huggingface.co/docs/hub/security-tokens
- **Install the `huggingface_hub` python package to authorize your token with the `huggingface-cli`** - https://huggingface.co/docs/huggingface_hub/quick-start

## Install

### Development

### Deployment

## Usage
