import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

export default function BasicTabViewer({children} : any) {
  return (
    <Tabs isFitted variant='enclosed'>
        <TabList mb='1em'>
            <Tab>From CSV File</Tab>
            <Tab>Create Manually</Tab>
        </TabList>
        <TabPanels>
            {children}
            {/* <TabPanel>
                <FromFile/>
            </TabPanel>
            <TabPanel>
                <Manual/>
            </TabPanel> */}
        </TabPanels>
    </Tabs>
  )
}
