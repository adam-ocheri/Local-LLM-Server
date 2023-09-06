"use client";


import ModelSelection from "@/components/modelSelection/ModelSelection";
import { providersList } from "@/utils/hfModel"
import { config } from "dotenv";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    config();
  },[])
  return (
    <main style={{}}>
      <h1 style={{textAlign:'center', fontSize: '46pt', margin: '50px', color: 'white'}}>AI LLM Local Server</h1>
      <div style={{minWidth: '80vw', minHeight: '80vh'}}>
        <ModelSelection providers={providersList}/>
      </div>
    </main>
  )
}

