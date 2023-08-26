"use client";

import { IHFModel } from "@/utils/hfModel";
import { ChangeEvent, useEffect, useState } from "react"
import axios from "axios";

export default function ModelSelectionForm({providers} : {providers : IHFModel[]}) {

    // Data - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    const [activeModel, setActiveModel] = useState({
      provider: '',
      model: '',
      availableModels: [""]
    });

    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      setActiveModel({
        provider: providers[0].provider,
        model: providers[0].availableModels[0],
        availableModels: [...providers[0].availableModels]
      })
    }, [])

    useEffect(()=>{setLoading(false)},[response])

    const {provider, model, availableModels} = activeModel;

    // Definitions - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    const postPromptRequest = async (e : any) => {
        e.preventDefault();
        if (prompt === '') return;

        const headers = {
            'Content-Type': 'application/json',
        };

        const baseAPI_URL = process?.env?.NODE_ENV == 'production' ? `http://127.0.0.1:4000/` : `http://localhost:4000/`;
        const modelDirPath = `${provider}/${model}`
        setLoading(true);
        const response = await axios.post(baseAPI_URL + `api/prompt?modelName=${modelDirPath}`, {prompt}, {headers})
        if (response.data) {
            setResponse(response.data.response)
        }
    }

    const setProvider = (e : any) => {
        console.log(e.target.value)
        for (let p of providers) {
            if (p.provider === e.target.value) {
                setActiveModel({
                    provider: p.provider,
                    model: p.availableModels[0],
                    availableModels: p.availableModels
                })
            }
        }
    }

    const setModelType = (e : any) => {
        console.log(e.target.value)
        setActiveModel(prev => ({...prev, model: e.target.value}))
    }
    
    // JSX - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    return (
        <section>
            <form style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}} onSubmit={(e) => {postPromptRequest(e)}}>
                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row'}}>
                    <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '1%'}}>
                        <label htmlFor="providerSelect">Provider</label>
                        <select onChange={(e) => {setProvider(e)}}>
                            {providers.map((p, index) => 
                            <option key={`PDR_${index}`} value={p.provider} >{p.provider}</option>
                            )}
                        </select>
                    </div>
                    
                    <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '1%'}}>
                        <label htmlFor="modelSelect">Model</label>
                        <select onChange={(e) => {setModelType(e)}}>
                            {activeModel.availableModels.map((model, index) => 
                            <option key={`MDL_${index}`} value={model} >{model}</option>
                        )}
                        </select>
                    </div>
                    
                </div>
                
                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '50%', margin: '0 auto' , borderRadius: '12px'}}>
                    <input 
                        style={{margin: '5%', padding: '1%'}} 
                        type="text"
                        name="prompt" 
                        value={prompt}
                        placeholder="write your prompt here..."  
                        onChange={(e) => {setPrompt(e.target.value)}}
                    />
                    <button 
                        type="submit" style={{background: '#010210', color: 'white', padding: '1%', margin: '0 auto', width: '25%', border: '2px solid aqua', borderRadius: '12px'}}
                    > SUBMIT
                    </button>
                </div>
                
            </form>
            
            <article style={{display: 'flex', alignItems: 'center', flexDirection: 'column',padding:'2%', margin: '8%', borderTop: '1px solid black'}}>
                {loading &&
                <div>
                    LOADING...
                </div>
                }

                {response && 
                <div>
                    <h3 style={{fontSize: '22pt'}}>RESPONSE</h3>
                    <p>
                        {response}
                    </p>
                </div>}
            </article>
        </section>
    );
  }