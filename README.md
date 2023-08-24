# HuggingFace Containers

## Description

This project utilizes Docker containers to setup the HuggingFace API and a Flask server, serving HuggingFace LL models through a Node backend via a React/Next.js frontend.
The default model used is the Meta LlamaV2 7-Billion parameters model.
A desired model name is passed via the `Request Params` of the HTTP request, and is consistent with the HuggingFace model naming convention, like the default `meta-llama/Llama-2-7b-hf` model name.
For more info, visit <HF\Models>

## Specs

To leverage the large cache size of the LLMs, these are kept as a Volume for the docker container.
This means, that with each time the image is built and run the cache files would be downloaded afresh. For development, cache is downloaded once and will be stored in the `./LLMs-Flask/models` directory after files are finished downloading.

- Min. installed Docker image size: 6.8 GB (after installing all dependencies)
- Min. default container size: 19.8 GB (after the container loaded up and finished downloading the default `Llama-7b` model ; This can be changed by the user)

## Prerequisites

### Development

### Deployment

## Install

## Usage
