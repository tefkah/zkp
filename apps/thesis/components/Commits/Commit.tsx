import {
  Text,
  Box,
  Heading,
  VStack,
  IconButton,
  Link as ChakraLink,
  HStack,
} from '@chakra-ui/react'

import { format, utcToZonedTime } from 'date-fns-tz'
import { formatDistance } from 'date-fns'
import { nl } from 'date-fns/locale'
import React from 'react'
import { IoIosGitCompare } from 'react-icons/io'
import { ArrowRightIcon, CloseIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'
import { SlimCommit } from '../../types/api'

const InitialButton = ({
  oid,
  setCompair,
}: {
  oid: string
  setCompair: (compair: string[]) => void
}) => (
  <IconButton
    size="xs"
    variant="ghost"
    icon={<IoIosGitCompare />}
    aria-label="Compare commit with another commit"
    onClick={() => setCompair([oid])}
  />
)
const GoButton = ({
  compair,
  oid,
  setCompair,
}: {
  compair: string[]
  oid: string
  setCompair: (compair: string[]) => void
}) =>
  compair?.[0] === oid ? (
    <IconButton
      icon={<CloseIcon />}
      aria-label="Stop comparing"
      size="xs"
      variant="ghost"
      onClick={() => setCompair([])}
    />
  ) : (
    <Link prefetch={false} passHref href={`/compare/${compair[0]}/${oid}`}>
      <IconButton icon={<ArrowRightIcon />} aria-label="Compare" size="xs">
        <ArrowRightIcon h={6} p={1} />
      </IconButton>
    </Link>
  )

export interface CompareButtonProps {
  compair: string[]
  setCompair: any
  oid: string
}
export const CompareButton = (props: CompareButtonProps) => {
  const { compair, setCompair, oid } = props

  return compair.length === 1 ? (
    <GoButton {...{ compair, setCompair, oid }} />
  ) : (
    <InitialButton {...{ oid, setCompair }} />
  )
}

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
  const [messageText, ...messageBodyRest] = message.split('\n')
  const messageBody = messageBodyRest.join(' ')
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
