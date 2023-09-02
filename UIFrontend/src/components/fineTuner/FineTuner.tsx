import React, { useState } from 'react'
import BasicAccordion from '../basicAccordion/BasicAccordion'
import BasicTabViewer from '../basicTabViewer/BasicTabViewer'
import CSVEditor from '../csvEditor/CSVEditor'
import { Button, Flex, TabPanel } from '@chakra-ui/react'
import CSVCreator from '../csvCreator/CSVCreator'
import FineTuneSettings from './FinetuneSettings'
import { initTraining, postCsvTrainingData } from '@/utils/apiService'


export default function FineTuner({setLoading, setResponse} : any) {

    const [csv, setCsv] = useState('')

    async function preprocessCsv() {

        await postCsvTrainingData(csv, setLoading, setResponse);
    }

    async function startTraining() {
        await initTraining({data: "..."}, setLoading, setResponse);
    }

    return (
        <BasicAccordion>
            <h3 style={{fontSize: '24pt', textAlign: 'center'}}>Fine Tune Menu</h3>
            <CSVCreator setLoading={setLoading} setResponse={setResponse} setCsv={setCsv}/>
            <FineTuneSettings/>
            <Flex direction={'row'} justifyContent={'space-around'} margin={'25px'}> 
                <Button variant={'outline'} colorScheme={'green'} onClick={preprocessCsv}>
                    Preprocess & Save 
                </Button>
                <Button variant={'outline'} colorScheme={'green'} onClick={startTraining}>
                    Start Training
                </Button>
            </Flex>
        </BasicAccordion>
    )
}
