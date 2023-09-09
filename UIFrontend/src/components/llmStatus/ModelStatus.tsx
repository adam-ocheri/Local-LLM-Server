
import { Box, Button, Wrap, WrapItem, useToast } from '@chakra-ui/react'
import { useState } from 'react'
export default function ModelStatus() {
    const toast = useToast()
    const statuses = ['success', 'error', 'warning', 'info']

    //migrate this?
    const [messageData, setMessageData] = useState({
      title : '',
      status: '',
      isClosable: false,
    })

    const DisplayMessage = (title : string, status : any, isClosable: boolean) =>
    toast({
      title,
      status,
      isClosable,
    })
  
    return (
      <Wrap>
        <div>TOAST COMP</div>
      </Wrap>
    )
  }