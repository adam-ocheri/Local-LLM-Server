"use client";

import { postPrompt, requestModelChange } from "@/utils/apiService";
import { IHFModel } from "@/utils/hfModel";
import { ChangeEvent, useEffect, useState } from "react"
import CSVEditor from "../csvEditor/CSVEditor";
import { Spinner } from "@chakra-ui/react";
import FineTuner from "../fineTuner/FineTuner";


export default function ModelSelection({providers} : {providers : IHFModel[]}) {

    // Data - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    const [modelChoice, setModelChoice] = useState({
      provider: '',
      model: '',
      availableModels: [""]
    });

    const [activeModel, setActiveModel] = useState('');
    const [modelNeedsReloading, setModelNeedsReloading] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadCycle, updateLoadCycle] = useState(0)

    const {provider, model, availableModels} = modelChoice;

    useEffect(() => {
      setModelChoice({
        provider: providers[0].provider,
        model: providers[0].availableModels[0],
        availableModels: [...providers[0].availableModels]
      })
      setActiveModel(`${providers[0].provider}/${providers[0].availableModels[0]}`)

      const INIT = async () => {
        const initModel = `${providers[0].provider}/${providers[0].availableModels[0]}`;
        const res = await requestModelChange({}, initModel, setLoading, setResponse);
        return res;
      }

    //   INIT();
    }, [])

    useEffect(()=> {
        if (activeModel == `${provider}/${model}`){
            setModelNeedsReloading(false)
        }
        else{
            setModelNeedsReloading(true)
        }
    }, [activeModel, provider, model])

    useEffect(()=>{setLoading(false)},[response])

    

    // Definitions - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    const postRequest = async (e : any) => {
        e.preventDefault();
        if (prompt === '' && !modelNeedsReloading) return;
        if (loading === true) return;

        if (modelNeedsReloading) {
            const res = await requestModelChange({}, `${provider}/${model}`, setLoading, setResponse);
            if (res) {
                console.log("RELOADED AIFH Model!");
                console.log(res);
                const {ModelUpdated} = res.data;
                setActiveModel(ModelUpdated);
            }
        } else {
            await postPrompt(prompt, activeModel, setLoading, setResponse);
        }
    }

    const setProvider = (e : any) => {
        console.log(e.target.value)
        for (let p of providers) {
            if (p.provider === e.target.value) {
                setModelChoice({
                    provider: p.provider,
                    model: p.availableModels[0],
                    availableModels: p.availableModels
                })
            }
        }
    }

    const setModelType = (e : any) => {
        console.log(e.target.value)
        setModelChoice(prev => ({...prev, model: e.target.value}))
    }
    
    // JSX - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    return (
        <section>
            <form style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}} onSubmit={(e) => {postRequest(e)}}>
                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row'}}>
                    <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '1%'}}>
                        <label htmlFor="providerSelect">Provider</label>
                        <select disabled={loading} onChange={(e) => {setProvider(e)}}>
                            {providers.map((p, index) => 
                            <option key={`PDR_${index}`} value={p.provider} >{p.provider}</option>
                            )}
                        </select>
                    </div>
                    
                    <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '1%'}}>
                        <label htmlFor="modelSelect">Model</label>
                        <select disabled={loading} onChange={(e) => {setModelType(e)}}>
                            {modelChoice.availableModels.map((model, index) => 
                            <option key={`MDL_${index}`} value={model} >{model}</option>
                        )}
                        </select>
                    </div>
                    {modelNeedsReloading && 
                    <div>
                        <span style={{background: '#ffffff', borderRadius: '50%', color: 'red', fontSize: '12pt', 
                            paddingTop: '4px', paddingBottom: '4px', paddingLeft: '8px', paddingRight:'8px'}}
                        >!</span>
                        <span style={{color: 'red', fontSize: '8pt', margin: '6px'}}>Model needs to be loaded</span>
                    </div>}
                </div>
                
                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '50%', margin: '0 auto' , borderRadius: '12px'}}>
                    <input 
                        style={{margin: '5%', padding: '1%'}} 
                        disabled={modelNeedsReloading}
                        type="text"
                        name="prompt" 
                        value={prompt}
                        placeholder="write your prompt here..."  
                        onChange={(e) => {setPrompt(e.target.value)}}
                    />
                    <button 
                        type="submit" style={{background: `${modelNeedsReloading ? '#2c324a' : '#01a210'}`, 
                        color: 'white', padding: '1%', margin: '0 auto', width: '25%', border: '2px solid black', 
                        borderRadius: '12px'
                    }}
                    > {modelNeedsReloading ? 'RELOAD' : 'Submit'}
                    </button>
                    {/* <CSVEditor setLoading={setLoading} setResponse={setResponse}/> */}
                    
                </div>
                { !modelNeedsReloading && <FineTuner setLoading={setLoading} setResponse={setResponse}/>}
            </form>
            
            <article style={{display: 'flex', alignItems: 'center', flexDirection: 'column',padding:'2%', margin: '8%', borderTop: '1px solid black'}}>
                {loading &&
                <div>
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
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