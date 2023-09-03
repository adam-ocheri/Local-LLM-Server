import React from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
  } from '@chakra-ui/react'

export default function BasicAccordion({children, title} : any) {
  return (
    <Accordion allowToggle={true} margin={'130px'} >
      <AccordionItem border={'1px solid black'} borderRadius={'12px'}>
        <h2>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='center' fontFamily={'heading'} fontSize={'2xl'} >
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
