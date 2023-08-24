import axios from "axios";
const baseAPI_URL = `http://localhost:5000/`;

export async function generateBasicPrompt(req : any, res : any)  {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        const {modelName} = req.query;

        console.log("Prompt route CALL")
        // const response = await axios.post(baseAPI_URL + "gen" + `?model=${modelName}`, req.body, {headers});
        // res.json(response.data);
        res.json({working: "yes! but still"});
    } catch (error : any) {
        throw new Error(error)
    }
}