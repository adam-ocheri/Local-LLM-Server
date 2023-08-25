import axios from "axios";
const baseAPI_URL = `http://127.0.0.1:5000/`;
export async function generateBasicPrompt(req, res) {
    try {
        console.log("Got REQUEST: ", req.body);
        const headers = {
            'Content-Type': 'application/json'
        };
        const { modelName } = req.query;
        const response = await axios.post(baseAPI_URL + "gen" + `?model=${modelName}`, req.body, { headers });
        res.json(response.data);
    }
    catch (error) {
        throw new Error(error);
    }
}
