

# Terminate the Python Flask app
pgrep -f "C:/Users/adamo/AppData/Local/Programs/Python/Python311/python.exe LLMs-Endpoint/app/app.py" | xargs kill

# Terminate the Node.js app
pkill -f "npm run start"

# Terminate the React UI
pkill -f "npm run dev"