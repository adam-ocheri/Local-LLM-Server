#!/bin/bash

# Create and set an environment variable
DEV_MODE=lazy-dev

# Export the environment variable to make it available to child processes
export DEV_MODE

# Change directory to the Flask app
# cd LLMs-Endpoint

# Run the Python Flask app in the background
C:/Users/adamo/AppData/Local/Programs/Python/Python311/python.exe LLMs-Endpoint/app/app.py &

# Move back to the project home directory
# cd ..

# Change directory to the Node app
cd BackendAPI-Node

# Run the Node.js app in the background
npm run start &

# Move back to the project home directory
cd ..

# Change directory to the React Frontend
cd UIFrontend

# Run the React UI in the background
npm run dev &