import React from 'react'
import BasicAccordion from '../basicAccordion/BasicAccordion'
import BasicTabViewer from '../basicTabViewer/BasicTabViewer'
import CSVEditor from '../csvEditor/CSVEditor'
import { Button, Flex, TabPanel } from '@chakra-ui/react'
import CSVCreator from '../csvCreator/CSVCreator'
import FineTuneSettings from './FinetuneSettings'


export default function FineTuner({setLoading, setResponse} : any) {
  return (
    <BasicAccordion>
        <h3 style={{fontSize: '24pt', textAlign: 'center'}}>Fine Tune Menu</h3>
        <CSVCreator setLoading={setLoading} setResponse={setResponse}/>
        <FineTuneSettings/>
        <Flex direction={'row'} justifyContent={'space-around'} margin={'25px'}> 
            <Button variant={'outline'} colorScheme={'green'}>
                Preprocess & Save 
            </Button>
            <Button variant={'outline'} colorScheme={'green'}>
                Start Training
            </Button>
        </Flex>
    </BasicAccordion>
  )
}
