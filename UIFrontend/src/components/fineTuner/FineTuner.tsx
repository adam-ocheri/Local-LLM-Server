import React, { useState } from 'react'
import BasicAccordion from '../basicAccordion/BasicAccordion'
import BasicTabViewer from '../basicTabViewer/BasicTabViewer'
import CSVEditor from '../csvEditor/CSVEditor'
import { Button, Flex, TabPanel } from '@chakra-ui/react'
import CSVCreator from '../csvCreator/CSVCreator'
import FineTuneSettings from './FinetuneSettings'
import { initTraining, postCsvTrainingData } from '@/utils/apiService'


export default function FineTuner({setLoading, setResponse} : any) {
    const [trainingParameters, updateTrainingParameters] = useState({});

    function getTrainingParams(trainingParams : any) {
        updateTrainingParameters(trainingParams);
    }

    const [csvContent, setCSVContent] = useState('')

    async function preprocessCsv() {

        await postCsvTrainingData(csvContent, setLoading, setResponse);
    }

    async function startTraining() {
        await initTraining({...trainingParameters}, setLoading, setResponse);
    }

    return (
        <BasicAccordion title={'FineTune Menu'}>
            {/* <h3 style={{fontSize: '12pt', textAlign: 'center'}}>Dataset Setup</h3> */}
            
            <BasicAccordion title={'Training Parameters'}>
                <FineTuneSettings getTrainingParams={getTrainingParams}/>
            </BasicAccordion>
            <CSVCreator csvContent={csvContent} setCSVContent={setCSVContent} />
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
