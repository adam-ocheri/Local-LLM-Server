const baseAPI_URL = process?.env?.NODE_ENV == 'production' ? `http://127.0.0.1:4000/` : `http://localhost:4000/`;
import axios from "axios";

export async function postPrompt (promptData : any, activeModel : string, setLoading : any, setResponse : any) {
    const headers = {
        'Content-Type': 'application/json',
    };

    setLoading(true);
    const response = await axios.post(baseAPI_URL + `api/prompt?modelName=${activeModel}`, {...promptData}, {headers})
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
        setResponse(response.data.ModelUpdated)
    }
    
    return response;
}

export async function postCsvTrainingData (csvData : string, setLoading : any) {
    const headers = {
        'Content-Type': 'application/json',
    };
    console.log('Trying to Send CSV data for fine-tuning.......', csvData);
    setLoading(true);
    const response = await axios.post(baseAPI_URL + `api/fine-tune`, {csvData}, {headers})
    if (response.data) {
        const success = response.data.response == "CSV preprocessed successfully";
        return success;
    }

    setLoading(false);
    return false;
    // if (response.data) {
    //     setResponse(response.data.response)
    // }
}

export async function verifyDataset (setLoading : any, setStatusMessage: any) {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    console.log('Verifying the validity of the dataset...');
    setLoading(true);
    const response = await axios.get(baseAPI_URL + `api/fine-tune`, {headers})
    if (response.data) {
        return response.data.datasetValid;
    }
    setLoading(false);
}

export async function initTraining (trainingData : any, setLoading : any) {
    const headers = {
        'Content-Type': 'application/json',
    };
    console.log('Starting training with finetune parameters.......', trainingData);
    setLoading(true);
    const response = await axios.post(baseAPI_URL + `api/train`, {trainingData}, {headers})
    if (response.data) {
        setLoading(false);
        return response.status == 200
    } else {
        return false
    };
}