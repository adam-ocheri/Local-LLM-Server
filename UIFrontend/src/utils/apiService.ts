const baseAPI_URL = process?.env?.NODE_ENV == 'production' ? `http://127.0.0.1:4000/` : `http://localhost:4000/`;
import axios from "axios";

export async function postPrompt (prompt : string, activeModel : string, setLoading : any, setResponse : any) {
    const headers = {
        'Content-Type': 'application/json',
    };

    setLoading(true);
    const response = await axios.post(baseAPI_URL + `api/prompt?modelName=${activeModel}`, {prompt}, {headers})
    if (response.data) {
        setResponse(response.data.response)
    }
}

export async function requestModelChange (data : any, newModel : string, setLoading : any, setResponse : any) {
    const headers = {
        'Content-Type': 'application/json',
    };

    setLoading(true);
    const response = await axios.post(baseAPI_URL + `api/prompt/reload?modelName=${newModel}`, {data}, {headers})
    if (response.data) {
        setResponse(response.data.response)
    }
    
    return response;
}