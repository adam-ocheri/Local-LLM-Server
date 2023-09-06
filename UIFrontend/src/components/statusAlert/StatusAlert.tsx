import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/react'
import React from 'react'

export default function StatusAlert({status, title, description} : any) {
  return (
    <Alert status={status}>
        <AlertIcon />
            <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}
