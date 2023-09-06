import React, { useState } from 'react'
import BasicAccordion from '../basicAccordion/BasicAccordion'
import BasicTabViewer from '../basicTabViewer/BasicTabViewer'
import CSVEditor from '../csvEditor/CSVEditor'
import { Button, Flex, TabPanel } from '@chakra-ui/react'
import CSVCreator from '../csvCreator/CSVCreator'
import FineTuneSettings from './FinetuneSettings'
import { initTraining, postCsvTrainingData, verifyDataset } from '@/utils/apiService'


export default function FineTuner({setLoading, setResponse, setStatusMessage} : any) {
    const [trainingParameters, updateTrainingParameters] = useState({});

    const setErrorMessage = (description : string, title: string) => {
        setLoading(false);
        setStatusMessage({
            status: 'error',
            title,
            description
        })
    }

    function getTrainingParams(trainingParams : any) {
        updateTrainingParameters(trainingParams);
    }

    const [csvContent, setCSVContent] = useState('')

    async function preprocessCsv() {
        const success = await postCsvTrainingData(csvContent, setLoading);
        if (success) {
            setStatusMessage("success", "Dataset Preprocessed", "new weights merged - Model has been successfully re-trained!")
        } else {
            setErrorMessage( 'check your dataset format & see logs for more info', "CSV Preprocessing Failed ");
        }
        setLoading(false);
    }

    async function startTraining() {     
        const datasetValid = await verifyDataset(setLoading, setStatusMessage);

        if (datasetValid) {
            const trainResult = await initTraining({...trainingParameters}, setLoading);
            if (trainResult) {
                setStatusMessage("success", "Training Completed", "new weights merged - Model has been successfully re-trained!")
            } else {
                setErrorMessage("Training was interrupted - check your dataset format & see logs for more info", 'Unable to Train Model');
            }
        } else {
            setErrorMessage("Must have a dataset pre-processed prior to training a model!", 'Unable to Train Model');
        }
        setLoading(false);
    }

    return (
        <BasicAccordion title={'FineTune Menu'} fontSize={'4xl'} >       
            <BasicAccordion title={'Training Parameters'} fontSize={'2xl'}>
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

// Helpers

