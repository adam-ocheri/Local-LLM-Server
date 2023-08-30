import axios from "axios";
const baseAPI_URL = process.env?.NODE_ENV == 'production' ? `http://quart-app:5000/` : `http://localhost:5000/`;
//TODO Queue system - Job-Id - extend timeout time
export async function triggerTrainingFromCSV(req, res) {
    console.log("Request arrived for CSV...", req.body);
    if (!req.body) {
        return res.status(400).send('No CSV file uploaded.');
    }
    const csvFile = req.body;
    const csvData = csvFile.csvData;
    // Handle the CSV data, e.g., save to a file or process it
    console.log('Received CSV data:', csvData);
    // Forward the CSV data to the Python Quart server
    try {
        const pythonServerResponse = await axios.post(baseAPI_URL + "fine-tune", { csvData }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Python server response:', pythonServerResponse.data);
        res.send('CSV uploaded and forwarded successfully :' + pythonServerResponse.data);
    }
    catch (error) {
        console.error('Error forwarding CSV data to Python server:', error?.message);
        res.status(500).send('Error forwarding CSV data to Python server.');
    }
}
