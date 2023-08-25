#!/bin/bash

# Change directory to the Flask app
cd LLMs-Flask

# Run the Python Flask app in the background
C:/Users/adamo/AppData/Local/Programs/Python/Python311/python.exe app/app.py &

# Move back to the project home directory
cd ..

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