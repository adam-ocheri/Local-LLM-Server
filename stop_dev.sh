#!/bin/bash

# Stop the Flask app
echo "Stopping Flask app..."
kill C:/Users/adamo/AppData/Local/Programs/Python/Python311/python.exe
echo "Flask app stopped"

# Stop the Node.js app
echo "Stopping Node.js app..."
kill "npm run start"
echo "Node.js app stopped"

# Stop the React UI
echo "Stopping React UI..."
kill "npm run dev"
echo "React UI stopped"

echo "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - "
echo "All apps stopped"
