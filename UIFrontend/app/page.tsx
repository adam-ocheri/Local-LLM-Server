"use client";

import ModelSelectionForm from "@/components/modelSelectionForm";
import { IHFModel, providersList } from "@/utils/hfModel"
import { config } from "dotenv";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    config();
  },[])
  return (
    <main style={{}}>
      <h1 style={{textAlign:'center', fontSize: '32pt', margin: '30px'}}>HuggingFace Local-Runtime AI Containers</h1>
      <div style={{minWidth: '80vw', minHeight: '80vh'}}>
        <ModelSelectionForm providers={providersList}/>
      </div>
    </main>
  )
}

