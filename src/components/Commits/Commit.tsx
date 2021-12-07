import { Text, Box, Heading, Flex, VStack, LinkBox, Container } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-scroll'
import { SlimCommit } from '../../api'

export const Commit = (props: SlimCommit) => {
  const { oid, message, date, additions, deletions } = props

  const formattedDate = new Date(date * 1000).toLocaleDateString()
  return (
    <LinkBox href={`/history/commit/${oid}`} w="100%">
      <Box px={4} w="100%" display="flex" justifyContent="space-between">
        <VStack display="flex" alignItems="flex-start">
          <Heading size="small">{message}</Heading>

          <Text color="gray.500">{formattedDate}</Text>
        </VStack>
        <VStack display="flex" alignItems="flex-end">
          <Text whiteSpace="nowrap" color="green.500">
            + {additions}
          </Text>
          <Text color="red.500" whiteSpace="nowrap">
            - {deletions}
          </Text>
        </VStack>
      </Box>
    </LinkBox>
  )
}
