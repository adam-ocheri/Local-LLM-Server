import axios from "axios";
const baseAPI_URL = process.env?.NODE_ENV == 'production' ? `http://quart-app:5000/` : `http://localhost:5000/`;

//TODO Queue system - Job-Id - extend timeout time
export async function generateBasicPrompt(req : any, res : any)  {
    try {
        console.log("Got REQUEST: ", req.body);
        const headers = {
            'Content-Type': 'application/json'
        };
        const {modelName} = req.query;
        const response = await axios.post(baseAPI_URL + "gen" + `?model=${modelName}`, req.body, {headers});
        res.json(response.data);

    } catch (error : any) {
        throw new Error(error)
    }
}