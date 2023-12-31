"use client";

import { postPrompt, requestModelChange } from "@/utils/apiService";
import { IHFModel } from "@/utils/hfModel";
import { ChangeEvent, useEffect, useState } from "react"
import { Flex, Select, Spinner } from "@chakra-ui/react";
import FineTuner from "../fineTuner/FineTuner";
import StatusAlert from "../statusAlert/StatusAlert";
import ModelStatus from "../llmStatus/ModelStatus";
import SliderInputBase from "../primitives/sliderInputBase/SliderInputBase";
import BasicAccordion from "../basicAccordion/BasicAccordion";


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
    const [promptParams, setPromptParams] = useState({temperature: 0.7, numBeams: 1, maxLength: 150})
    const [response, setResponse] = useState('');
    const [statusMessage, setStatusMessage] = useState({status: '', title: '', description: ''});
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [loadCycle, updateLoadCycle] = useState(0)

    const {provider, model, availableModels} = modelChoice;
    const {temperature, numBeams, maxLength} = promptParams;

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

    useEffect(()=>{
        if (loading) {
            resetStatus();
            setResponse('');
        }
    },[loading])
    

    // Definitions - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    const updatePromptParams = (e: any, name: string) => {
        console.log("Updating training params...", e)

        if (e?.target && e.type == 'change') {
            setPromptParams(prev => ({
                ...prev,
                [e.target.name]: e.target.checked
            }))
        } else if (e?.target ) {
            setPromptParams(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }))
        } 
        else {
            setPromptParams(prev => ({
                ...prev,
                [name]: e
            }))
        }
    }

    const postRequest = async (e : any) => {
        e.preventDefault();
        if (prompt === '' && !modelNeedsReloading) return;
        if (loading === true) return;

        if (modelNeedsReloading) {
            const res = await requestModelChange({}, `${provider}/${model}`, setLoading, setResponse);
            if (res) {
                console.log("RELOADED AI HF Model!");
                console.log(res);
                const {ModelUpdated} = res.data;
                setActiveModel(ModelUpdated);
            }
        } else {
            await postPrompt({prompt, temperature, numBeams, maxLength}, activeModel, setLoading, setResponse);
            setLoading(false)
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

    const resetStatus = () => {
        setStatusMessage({status: '', title: '', description: ''});
    }
    
    // JSX - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    return (
        <section>
            <form style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', background: '#12121243', borderRadius: '8px'}} onSubmit={(e) => {postRequest(e)}}>
                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row'}}>
                    <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '1%', textAlign: 'center'}}>
                        <label htmlFor="providerSelect">Provider</label>
                        <Select background={'white'} disabled={loading} onChange={(e) => {setProvider(e)}}>
                            {providers.map((p, index) => 
                            <option key={`PDR_${index}`} value={p.provider} >{p.provider}</option>
                            )}
                        </Select>
                    </div>
                    
                    <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '1%', textAlign: 'center'}}>
                        <label htmlFor="modelSelect">Model</label>
                        <Select background={'white'} disabled={loading} onChange={(e) => {setModelType(e)}}>
                            {modelChoice.availableModels.map((model, index) => 
                            <option key={`MDL_${index}`} value={model} >{model}</option>
                        )}
                        </Select>
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
                            disabled={loading}
                            type="submit" className="btn-base" style={{margin: "0 auto"}}
                        > {modelNeedsReloading ? 'RELOAD' : 'Submit'}
                        </button>
                    {/* <Flex direction={'row'} margin={'8'} justifyContent={'space-around'}> */}
                    <BasicAccordion title={'Prompt Settings'} fontSize={'8pt'}>
                        <Flex direction={'row'} margin={'8'} justifyContent={'center'} color={'white'} background={'#01010122'} borderRadius={'2xl'}>
                            <Flex direction={'column'} >
                                <SliderInputBase
                                    name={'numBeams'}
                                    title={'Beams Number'}
                                    value={numBeams}
                                    min={1}
                                    max={15}
                                    step={1}
                                    updateParams={updatePromptParams}
                                />
                                <SliderInputBase
                                name={'maxLength'}
                                title={'Max Sequence Length'}
                                value={maxLength}
                                min={50}
                                max={500}
                                step={1}
                                updateParams={updatePromptParams}
                            />
                            </Flex>
                            <Flex direction={'column'}>
                                <SliderInputBase
                                    name={'temperature'}
                                    title={'Inference Temperature'}
                                    value={temperature}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    updateParams={updatePromptParams}
                                />
                            </Flex>  
                            
                        </Flex>
                    </BasicAccordion>    
                    {/* </Flex> */}
                    
                    
                </div>
                
                
                <Flex justifyContent={'center'}>
                    {response && !loading && 
                    <Flex justifyContent={'center'} flexDirection={'column'} background={'ButtonShadow'} borderRadius={'md'} padding={'8'} margin={'8'}>
                        <h3 style={{fontSize: '22pt', background: 'black', color: 'white', borderRadius: '6px', padding: '8px'}}>RESPONSE</h3>
                        <p style={{padding: '6px', margin: '8px'}}>
                            {response}
                        </p>
                    </Flex>}
                    {loading ?
                        <div style={{minHeight:'200px', margin: '20px'}}>
                            <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.500'
                                size='xl'
                            />
                        </div>
                        : 
                        <div style={{minHeight:'200px'}}></div>
                    }
                </Flex>
            </form>
            
            { !modelNeedsReloading && <FineTuner setLoading={setLoading} setResponse={setResponse} setStatusMessage={setStatusMessage}/>}
            
            <article style={{display: 'flex', alignItems: 'center', flexDirection: 'column',padding:'2%', margin: '8%'}}>
                
            {statusMessage.status && 
                <div>
                    <StatusAlert status={statusMessage.status} title={statusMessage.title} description={statusMessage.description}/>
                </div>}
                
            </article>
            {/* <ModelStatus/> */}
        </section>
    );
  }