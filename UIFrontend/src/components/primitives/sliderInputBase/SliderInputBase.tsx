import { Box, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from '@chakra-ui/react'
import React from 'react'

export default function SliderInputBase({name, title, value, updateParams, min, max, step} : any) {
  return (
    <Box margin={'5px'} padding={'5px'} background={'#33334444'} borderRadius={'8px'}>
        <Text background={'#333344'} padding={'4px'} borderRadius={'3px'}>{title}</Text>
        <Text color={'#0a3bcc'}>{value}</Text>
        <Slider aria-label='slider-ex-2' value={value} min={min} max={max} step={step} name={name} onChange={(e) => updateParams(e, name)}>
            <SliderTrack>
                <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
        </Slider>
    </Box>
  )
}
