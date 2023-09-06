import React from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
  } from '@chakra-ui/react'

export default function BasicAccordion({children, title, fontSize} : any) {
  return (
    <Accordion allowToggle={true} margin={'130px'}  >
      <AccordionItem border={'1px solid #333344'} borderRadius={'12px'} color={'white'} backgroundColor={'#444444'} boxShadow={'dark-lg'}>
        <h2>
          <AccordionButton backgroundColor={'#02a4d6'} _hover={{backgroundColor: '#0056b3'}} borderRadius={'12px'}>
            <Box as="span" flex='1' textAlign='center' fontFamily={'heading'} fontSize={fontSize} >
              {title}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel>
            {children}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
