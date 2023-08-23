#!/bin/bash

# Change directory to the Flask app
cd LLMs-Flask

# Run the Python Flask app in the background
python app.py &

# Move back to the project home directory
cd ..

# Change directory to the Node app
cd BackendAPI-Node

# Run the Node.js app in the background
node server.js &

# Move back to the project home directory
cd ..
