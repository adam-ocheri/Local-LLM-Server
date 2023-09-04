// start.js
const { exec } = require('child_process');

// Start the JavaScript Frontend
const jsFrontend = exec('cd UIFrontend && npm run dev'); // Replace 'your-js-app.js' with your JS app file

// Start the JavaScript Backend API
const jsBackendAPI = exec('cd BackendAPI-Node && npm run start'); // Replace 'your-js-app.js' with your JS app file

// Start the LLM Server
const llmServer = exec('cd LLMs-Endpoint/app && C:/Users/adamo/AppData/Local/Programs/Python/Python311/python.exe app.py'); // Replace 'your-python-app.py' with your Python app file

jsFrontend.stdout.on('data', (data) => {
    console.log(`JS App Output: ${data}`);
});

jsBackendAPI.stdout.on('data', (data) => {
    console.log(`JS App Output: ${data}`);
});

llmServer.stdout.on('data', (data) => {
    console.log(`Python App Output: ${data}`);
});