import axios from "axios";
const baseAPI_URL = `http://localhost:5000/`;
export async function generateBasicPrompt(req, res) {
    try {
        const { modelName } = req.query;
        const response = await axios.post(baseAPI_URL + `?model=${modelName}`, req.body);
        res.json(response.data);
        // res.json(`Hello Response! | ${modelName} | ${prompt}`)
    }
    catch (error) {
        throw new Error(error);
    }
}
