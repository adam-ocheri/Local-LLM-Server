import { useEffect, useState } from 'react'
import { Box, Flex, FormControl, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Radio, RadioGroup, Select, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack, Switch, Text } from '@chakra-ui/react'
import SliderInputBase from '../primitives/sliderInputBase/SliderInputBase';
import NumberInputBase from '../primitives/numberInputBase/NumberInputBase';

export default function FineTuneSettings({ getTrainingParams }: any) {
    const [trainingParams, setTrainingParams] = useState({
        maxSteps: 16,
        matricesUpdateRank: 16,
        scalingFactor: 32,
        perDeviceTrainBatchSize: 1,
        gradientAccumulationSteps: 512,
        warmupSteps: 0,
        bias: 'none',
        taskType: 'CAUSAL_LM',
        learningRate: 0.00005,
        dropoutProbability: 0.1,
        pushToHub: 'false',
        hfUsername: '',
        newModelDir: ''
    })

    const {
        warmupSteps,
        maxSteps,
        gradientAccumulationSteps,
        matricesUpdateRank,
        scalingFactor,
        perDeviceTrainBatchSize,
        learningRate,
        dropoutProbability,
        pushToHub,
        hfUsername,
        newModelDir,
        bias,
        taskType
    } = trainingParams;

    const updateTrainingParams = (e: any, name: string) => {
        console.log("Updating training params...", e)

        if (e?.target && e.type == 'change') {
            setTrainingParams(prev => ({
                ...prev,
                [e.target.name]: e.target.checked
            }))
        } else if (e?.target ) {
            setTrainingParams(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }))
        } 
        else {
            setTrainingParams(prev => ({
                ...prev,
                [name]: e
            }))
        }
    }

    useEffect(() => {
        getTrainingParams(trainingParams)
    }, [trainingParams])

    return (
        <Box margin={'120px'}>
            <Box margin={'5px'} padding={'5px'} background={'#33334444'} borderRadius={'8px'}>
                <Text background={'#333344'} padding={'4px'} borderRadius={'3px'}>Task Type</Text>
                <Select name='taskType' value={taskType} onChange={(e) => updateTrainingParams(e, "taskType")} backgroundColor={'#eeeeee'} color={'#0a3bcc'}>
                    <option value="CAUSAL_LM">CAUSAL_LM</option>
                    <option value="TOKEN_CLS">TOKEN_CLS</option>
                    <option value="SEQ_2_SEQ_LM">SEQ_2_SEQ_LM</option>
                    <option value="QUESTION_ANS">QUESTION_ANS</option>
                    <option value="FEATURE_EXTRACTION">FEATURE_EXTRACTION</option>
                </Select>
            </Box>

            <Box margin={'5px'} padding={'5px'} background={'#33334444'} borderRadius={'8px'}>
                <Text background={'#333344'} padding={'4px'} borderRadius={'3px'}>Bias</Text>
                <RadioGroup onChange={(e) => updateTrainingParams(e, "bias")} value={bias} name='bias' color={'#0a3bcc'}>
                    <Stack direction='row'>
                        <Radio value='none'>None</Radio>
                        <Radio value='all'>All</Radio>
                        <Radio value='lora_only'>Bias Only</Radio>
                    </Stack>
                </RadioGroup>
            </Box>

            <FormControl display='flex' alignItems='center' margin={'5px'} padding={'5px'} background={'#33334444'} borderRadius={'8px'}>
                <Flex direction={'column'}>
                    <FormLabel htmlFor='email-alerts' mb='2' background={'#333344'} padding={'4px'} borderRadius={'3px'}>
                        Upload to hub?
                    </FormLabel>
                    <Switch name='pushToHub' value={pushToHub} onChange={(e) => updateTrainingParams(e, "pushToHub")} id='email-alerts' />
                    <Flex>
                        <Input disabled={!pushToHub} name='hfUsername' value={hfUsername} onChange={(e) => updateTrainingParams(e, "hfUsername")} placeholder='HuggingFace Username' />
                        <Text color={'grey'} fontSize={'24pt'}>/</Text>
                        <Input disabled={!pushToHub} name='newModelDir' value={newModelDir} onChange={(e) => updateTrainingParams(e, "newModelDir")} placeholder='Model Name or Path on HF' />
                    </Flex>
                </Flex>
            </FormControl>

            <Flex direction={'row'} justifyContent={'space-around'}>
                <Flex direction={'column'}>
                    <NumberInputBase 
                        name={'matricesUpdateRank'}
                        title={'Matrices Update-Rank'}
                        value={matricesUpdateRank}
                        min={8}
                        max={64}
                        step={8}
                        updateTrainingParams={updateTrainingParams}
                    />
                    <NumberInputBase 
                        name={'scalingFactor'}
                        title={'Scaling Factor'}
                        value={scalingFactor}
                        min={8}
                        max={64}
                        step={8}
                        updateTrainingParams={updateTrainingParams}
                    />
                    <NumberInputBase 
                        name={'perDeviceTrainBatchSize'}
                        title={'Per Device Training Batch Size'}
                        value={perDeviceTrainBatchSize}
                        min={1}
                        max={64}
                        step={1}
                        updateTrainingParams={updateTrainingParams}
                    />
                    {/* <Box>
                        <Text>Scaling Factor</Text>
                        <NumberInput value={scalingFactor} precision={2} step={8} min={8} max={64} name='scalingFactor' onChange={(e) => updateTrainingParams(e, "scalingFactor")}>
                            <NumberInputField background={'white'} color={'#00aaff'} />
                            <NumberInputStepper>
                                <NumberIncrementStepper background={'#00aaff'} />
                                <NumberDecrementStepper background={'#00aaff'} />
                            </NumberInputStepper>
                        </NumberInput>
                    </Box>
                    <Box>
                        <Text>Per Device Training Batch Size</Text>
                        <NumberInput value={perDeviceTrainBatchSize} step={1} min={1} max={64} name='perDeviceTrainBatchSize' onChange={(e) => updateTrainingParams(e, "perDeviceTrainBatchSize")}>
                            <NumberInputField background={'white'} color={'#00aaff'} />
                            <NumberInputStepper>
                                <NumberIncrementStepper background={'#00aaff'} />
                                <NumberDecrementStepper background={'#00aaff'} />
                            </NumberInputStepper>
                        </NumberInput>
                    </Box> */}
                </Flex>

                <Flex direction={'column'}>
                    <SliderInputBase
                        name={'dropoutProbability'}
                        title={'Dropout Probability'}
                        value={dropoutProbability}
                        min={0.0}
                        max={1.0}
                        step={0.05}
                        updateTrainingParams={updateTrainingParams}
                    />
                    <SliderInputBase
                        name={'learningRate'}
                        title={'Learning Rate'}
                        value={learningRate}
                        min={0.00005}
                        max={0.2}
                        step={0.00001}
                        updateTrainingParams={updateTrainingParams}
                    />
                    <SliderInputBase
                        name={'maxSteps'}
                        title={'Max Steps'}
                        value={maxSteps}
                        min={8}
                        max={10000}
                        step={1}
                        updateTrainingParams={updateTrainingParams}
                    />
                    <SliderInputBase
                        name={'warmupSteps'}
                        title={'Warmup Steps'}
                        value={warmupSteps}
                        min={0}
                        max={64}
                        step={1}
                        updateTrainingParams={updateTrainingParams}
                    />
                    <SliderInputBase
                        name={'gradientAccumulationSteps'}
                        title={'Gradient Accumulation Steps'}
                        value={gradientAccumulationSteps}
                        min={0}
                        max={1024}
                        step={1}
                        updateTrainingParams={updateTrainingParams}
                    />
                    {/* <Box margin={'25px'} padding={'5px'} background={'#33334444'} borderRadius={'8px'}>
                        <Text background={'#333344'} padding={'4px'} borderRadius={'3px'}>Dropout Probability </Text>
                        <Text color={'#0a3bcc'}>{dropoutProbability}</Text>
                        <Slider aria-label='slider-ex-2' value={dropoutProbability} min={0.0} max={1.0} step={0.01} name='dropoutProbability' onChange={(e) => updateTrainingParams(e, "dropoutProbability")}>
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </Box>
                    <Box margin={'25px'}>
                        <Text>Learning Rate </Text> <Text color={'blue.700'}>{learningRate}</Text>
                        <Slider aria-label='slider-ex-2' colorScheme='pink' value={learningRate} min={0.00005} max={0.2} step={0.00001} name='learningRate' onChange={(e) => updateTrainingParams(e, "learningRate")}>
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </Box>
                    <Box margin={'25px'}>
                        <span> <Text>Max Steps  </Text>  <Text color={'blue.700'}>{maxSteps}</Text> </span>
                        <Slider aria-label='slider-ex-2' colorScheme='pink' value={maxSteps} min={8} max={1000} step={1} name='maxSteps' onChange={(e) => updateTrainingParams(e, "maxSteps")}>
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </Box>
                    <Box margin={'25px'}>
                        <Text>Warmup Steps </Text> <Text color={'blue.700'}>{warmupSteps}</Text>
                        <Slider aria-label='slider-ex-2' colorScheme='pink' value={warmupSteps} min={0} max={64} step={1} name='warmupSteps' onChange={(e) => updateTrainingParams(e, "warmupSteps")}>
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </Box>
                    <Box margin={'25px'}>
                        <Text>Gradient Accumulation Steps </Text> <Text color={'blue.700'}>{gradientAccumulationSteps}</Text>
                        <Slider aria-label='slider-ex-2' colorScheme='pink' value={gradientAccumulationSteps} min={0} max={64} step={1} name='gradientAccumulationSteps' onChange={(e) => updateTrainingParams(e, "gradientAccumulationSteps")}>
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </Box> */}
                </Flex>
            </Flex>
        </Box>
    )
}
