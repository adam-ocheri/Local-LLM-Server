import axios from "axios";
const baseAPI_URL = `http://localhost:5000/`;

export async function generateBasicPrompt(req : any, res : any)  {
    try {
        const {modelName} = req.params;
        const response = await axios.post(baseAPI_URL + `?model=${modelName}`, req.body);
        res.json(response.data);
        // res.json(`Hello Response! | ${modelName} | ${prompt}`)
    } catch (error : any) {
        throw new Error(error)
    }
}