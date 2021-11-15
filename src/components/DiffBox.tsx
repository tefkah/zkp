import { Text, Box, Container, Flex } from '@chakra-ui/react'
import React from 'react'
import { noteStyle } from './NoteStyle'

interface Props {
  oid: string
  additions: number
  deletions: number
  filepath: string
  children: React.ReactFragment
}

export const DiffBox = (props: Props) => {
  const { oid, additions, deletions, filepath, children } = props
  return (
    <Container my={10}>
      <Flex alignItems="center" justifyContent="space-between">
        <Text>{filepath}</Text>
        <Flex>
          <Text mx={3} color="red.500">{`-${deletions}`}</Text>
          <Text color="green.500">{`+${additions}`}</Text>
        </Flex>
      </Flex>
      <Container sx={{ ...noteStyle }}>{children}</Container>
    </Container>
  )
}
