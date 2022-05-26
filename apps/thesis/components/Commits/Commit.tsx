import { Text, Box, Heading, VStack, Link as ChakraLink, HStack } from '@chakra-ui/react'

import { format, utcToZonedTime } from 'date-fns-tz'
import { formatDistance } from 'date-fns'
import { nl } from 'date-fns/locale'
import React from 'react'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'
import { SlimCommit } from '@zkp/types'
import { CompareButton } from './CompareButton'

interface CommitProps extends SlimCommit {
  compair: string[]
  setCompair: any
  slim?: boolean
}

export const Commit = (props: CommitProps) => {
  const { oid, slim, message, date, additions, deletions, compair, setCompair } = props

  const dateThing = new Date(date * 1000)
  const dateObj = utcToZonedTime(dateThing, 'Europe/Amsterdam')
  const time = format(dateObj, 'HH:mm', { timeZone: 'Europe/Amsterdam', locale: nl })
  const timeDistance = formatDistance(dateObj, new Date(), { addSuffix: true })
  const formattedDate = `${timeDistance}, at ${time}`
  const [messageText, ...messageBodyRest] = message?.split('\n') || ['']
  const messageBody = messageBodyRest?.join(' ')

  return (
    <Box px={slim ? 0 : 4} w="100%" display="flex" justifyContent="space-between">
      <VStack alignItems="flex-start">
        <VStack alignItems="flex-start" spacing={0}>
          <Heading size="small">
            <Link href={`/commit/${oid}`}>{messageText}</Link>
          </Heading>
          <HStack spacing={2} alignItems="center">
            <Text color="gray.500">{formattedDate}</Text>
            {!slim && (
              <HStack alignItems="center">
                <CompareButton {...{ oid, compair, setCompair }} />
                <ChakraLink
                  isExternal
                  href={`https://github.com/ThomasFKJorna/thesis-writing/commit/${oid}`}
                  _hover={{ color: 'gray.400' }}
                  transition="color 0.2s"
                >
                  <FaGithub />
                </ChakraLink>
              </HStack>
            )}
          </HStack>
        </VStack>
        {messageBody && <Text>{messageBody}</Text>}
      </VStack>
      <VStack display="flex" alignItems="flex-end">
        <Text whiteSpace="nowrap" color="green.500">
          + {additions}
        </Text>
        <Text color="primary" whiteSpace="nowrap">
          - {deletions}
        </Text>
      </VStack>
    </Box>
  )
}

Commit.defaultProps = { slim: false }
