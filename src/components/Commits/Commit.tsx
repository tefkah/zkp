import {
  Text,
  Box,
  Heading,
  Flex,
  VStack,
  LinkBox,
  Container,
  LinkOverlay,
  IconButton,
  CloseButton,
  Icon,
} from '@chakra-ui/react'

import { format, utcToZonedTime } from 'date-fns-tz'
import { formatDistance } from 'date-fns'
import { nl } from 'date-fns/locale'
import React from 'react'
import { SlimCommit } from '../../api'
import { IoIosGitCompare } from 'react-icons/io'
import { ArrowRightIcon } from '@chakra-ui/icons'
import Link from 'next/link'

interface CommitProps extends SlimCommit {
  compair: string[]
  setCompair: any
}

export const Commit = (props: CommitProps) => {
  const { oid, message, date, additions, deletions, compair, setCompair } = props

  const dateThing = new Date(date * 1000)
  const dateObj = utcToZonedTime(dateThing, 'Europe/Amsterdam')
  const time = format(dateObj, 'HH:mm', { timeZone: 'Europe/Amsterdam', locale: nl })
  const timeDistance = formatDistance(dateObj, new Date(), { addSuffix: true })
  const formattedDate = `${timeDistance}, at ${time}`
  return (
    <Box px={4} w="100%" display="flex" justifyContent="space-between">
      <VStack display="flex" alignItems="flex-start">
        <Heading size="small">
          <Link href={`/commit/${oid}`}>{message}</Link>
        </Heading>

        <Text color="gray.500">{formattedDate}</Text>
      </VStack>
      <CompareButton {...{ oid, compair, setCompair }} />
      <VStack display="flex" alignItems="flex-end">
        <Text whiteSpace="nowrap" color="green.500">
          + {additions}
        </Text>
        <Text color="red.500" whiteSpace="nowrap">
          - {deletions}
        </Text>
      </VStack>
    </Box>
  )
}

export interface CompareButtonProps {
  compair: string[]
  setCompair: any
  oid: string
}
export const CompareButton = (props: CompareButtonProps) => {
  const { compair, setCompair, oid } = props

  const InitialButton = () => (
    <IconButton
      variant="ghost"
      icon={<IoIosGitCompare />}
      aria-label="Compare commit with another commit"
      onClick={() => setCompair([oid])}
    />
  )

  const GoButton = () =>
    compair?.[0] === oid ? (
      <CloseButton variant="ghost" onClick={() => setCompair([])} />
    ) : (
      <Link href={`/compare/${compair[0]}/${oid}`}>
        <Icon as={ArrowRightIcon} aria-label="Let's goo" />
      </Link>
    )

  return compair.length === 1 ? <GoButton /> : <InitialButton />
}
