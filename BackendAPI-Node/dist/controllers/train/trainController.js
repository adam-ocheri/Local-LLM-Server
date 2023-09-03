import axios from "axios";
const baseAPI_URL = process.env?.NODE_ENV == 'production' ? `http://quart-app:5000/` : `http://localhost:5000/`;
//TODO Queue system - Job-Id - extend timeout time
export async function startTraining(req, res) {
    console.log("Request arrived for training start...", req.body);
    if (!req.body) {
        return res.status(400).send('Error: No training parameters set.');
    }
    try {
        const pythonServerResponse = await axios.post(baseAPI_URL + "train", { ...req.body }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Python server response:', pythonServerResponse.data);
        res.json(pythonServerResponse.data);
    }
    catch (error) {
        const message = 'Error: Training Failed. the python server responded with error, or request has timed out';
        console.error(message, error?.message);
        res.status(500).send(message);
    }
}
