
import { Box, Button, Wrap, WrapItem, useToast } from '@chakra-ui/react'
export default function ModelStatus() {
    const toast = useToast()
    const statuses = ['success', 'error', 'warning', 'info']
  
    return (
      <Wrap>
        {statuses.map((status : any, i) => (
          <WrapItem key={i}>
            <Button
              onClick={() =>
                toast({
                  title: `${status} toast`,
                  status: status,
                  isClosable: true,
                })
              }
            >
              Show {status} toast
            </Button>
          </WrapItem>
        ))}
      </Wrap>
    )
  }