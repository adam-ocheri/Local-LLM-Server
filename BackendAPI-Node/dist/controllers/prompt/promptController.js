import axios from "axios";
const baseAPI_URL = `http://localhost:5000/`;
export async function generateBasicPrompt(req, res) {
    try {
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
