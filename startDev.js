// start.js
const { exec } = require('child_process');

// Start the LLM Server
const llmServer = exec('C:/Users/adamo/AppData/Local/Programs/Python/Python311/python.exe LLMs-Endpoint/app/app.py');

// // Start the JavaScript Frontend
// const jsFrontend = exec('cd UIFrontend && npm run dev');

// // Start the JavaScript Backend API
// const jsBackendAPI = exec('cd BackendAPI-Node && npm run start');



// jsFrontend.stdout.on('data', (data) => {
//     console.log(`JS App Output: ${data}`);
// });

// jsBackendAPI.stdout.on('data', (data) => {
//     console.log(`JS App Output: ${data}`);
// });

llmServer.stdout.on('data', (data) => {
    console.log(`Python App Output: ${data}`);
});

llmServer.stdout.on('connection', (data) => {
    console.log(`Python App Output: ${data}`);
});