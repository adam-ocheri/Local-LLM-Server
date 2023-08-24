# HuggingFace Containers

## Description

This project utilizes Docker containers to setup the HuggingFace API and a Flask server, serving HuggingFace LL models through a Node backend via a React/Next.js frontend.
The default model used is the Meta LlamaV2 7-Billion parameters model.
A desired model name is passed via the `Request Params` of the HTTP request, and is consistent with the HuggingFace model naming convention, like the default `meta-llama/Llama-2-7b-hf` model name.
For more info, visit <HF\Models>

## Specs

- Min. installed Docker image size: 6.8 GB (after installing all dependencies)
- Min. default container size: 19.8 GB (after the container loaded up and finished downloading the default `Llama-7b` model ; This can be changed by the user)

## Development Prerequisites

## Production Prerequisites

## Install

## Usage
