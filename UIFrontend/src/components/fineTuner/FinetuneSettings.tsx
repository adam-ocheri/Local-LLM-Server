import {useState} from 'react'
import { Box, FormControl, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Radio, RadioGroup, Select, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack, Switch } from '@chakra-ui/react'

export default function FineTuneSettings() {

    const [value, setValue] = useState('1')

    return (
        <Box margin={'40px'}>
            <Slider aria-label='slider-ex-2' colorScheme='pink' defaultValue={30}>
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
            <SliderThumb />
            </Slider>
            <Select placeholder='Select option'>
                <option value='option1'>Option 1</option>
                <option value='option2'>Option 2</option>
                <option value='option3'>Option 3</option>
            </Select>
            <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='email-alerts' mb='0'>
                    Use PEFT?
                </FormLabel>
                <Switch id='email-alerts' />
            </FormControl>
            <NumberInput defaultValue={15} precision={2} step={0.2} min={7} max={42.42}>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
            <RadioGroup onChange={setValue} value={value}>
            <Stack direction='row'>
                <Radio value='1'>First</Radio>
                <Radio value='2'>Second</Radio>
                <Radio value='3'>Third</Radio>
            </Stack>
            </RadioGroup>
        </Box>
    )
}
