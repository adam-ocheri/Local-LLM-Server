import { Box, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from '@chakra-ui/react'
import React from 'react'

export default function NumberInputBase({name, title, value, updateTrainingParams, min, max, step} : any) {
  return (
    <Box margin={'5px'} padding={'5px'} background={'#33334444'} borderRadius={'8px'}>
        <Text background={'#333344'} padding={'4px'} borderRadius={'3px'}>{title}</Text>
        <NumberInput value={value} precision={0} step={step} min={min} max={max} name={name} onChange={(e) => updateTrainingParams(e, name)}>
            <NumberInputField background={'white'} color={'#0a3bcc'} />
            <NumberInputStepper >
                <NumberIncrementStepper background={'#00aaff'} />
                <NumberDecrementStepper background={'#00aaff'} />
            </NumberInputStepper>
        </NumberInput>
    </Box>
  )
}