import {
  Link as ChakraLink,
  Text,
  Box,
  Container,
  useColorMode,
  Flex,
  VStack,
  HStack,
  Button,
} from '@chakra-ui/react'
import { join } from 'path'
import React, { ReactElement, useState } from 'react'
import Header from '../../components/Header'
import { readFileSync } from 'fs'
import { getListOfCommitsWithStats } from '../../utils/getListOfCommitsWithStats'
import { CommitList } from '../../components/Commits/CommitList'
import { CommitPerDateLog, DateCommit } from '../../lib/api'
import { HistoryGraph } from '../../components/HistoryGraph'
import Link from 'next/link'
import Footer from '../../components/Footer'
import Head from 'next/head'
import BasicLayout from '../../components/Layouts/BasicLayout'
import ActivityLayout from '../../components/Layouts/ActivityLayout'

export interface SlimCommit {
  oid: string
  message: string
  date: number
  additions: number
  deletions: number
  files: any[]
}

interface ActivityPageProps {
  log: CommitPerDateLog
}
const findCommitXDaysAgo = (log: DateCommit[], days: number): string => {
  const today = new Date()
  const unixTime = days * 3600 * 24 * 1000
  const commit = log.find(
    (commit) => today.getTime() - new Date(commit.totalDate * 1000).getTime() > unixTime,
  )

  return commit?.lastOid || ''
}

export default function ActivityPage(props: ActivityPageProps) {
  const { log } = props
  const [diffs, setDiffs] = useState()
  const theme = useColorMode()
  const dark = theme.colorMode === 'dark'
  const reverseLogValues = Object.values(log).reverse()
  return (
    <>
      <Head>
        <title>Activity | Thomas' Thesis</title>
      </Head>
      <VStack justifyContents="center" spacing={6} mt={20}>
        <Box w="80%" height={100} backgroundColor={dark ? 'gray.800' : 'gray.50'}>
          <HistoryGraph data={log} dark={dark} diffs={diffs} setDiffs={setDiffs} />
        </Box>
        <HStack spacing={5}>
          <Link
            prefetch={false}
            href={`/compare/${findCommitXDaysAgo(reverseLogValues, 7)}/${
              reverseLogValues[0].lastOid
            }`}
          >
            <ChakraLink transition="color 0.2s" _hover={{ color: 'primary' }}>
              Last week
            </ChakraLink>
          </Link>
          <Link
            href={`/compare/${findCommitXDaysAgo(reverseLogValues, 30)}/${
              reverseLogValues[0].lastOid
            }`}
            prefetch={false}
          >
            <ChakraLink transition="color 0.2s" _hover={{ color: 'primary' }}>
              Last month
            </ChakraLink>
          </Link>
        </HStack>
      </VStack>
      <Box mx={{ base: '5%', md: '15%' }} my={{ base: 5, md: 20 }}>
        <CommitList commitLog={log} />
      </Box>
    </>
  )
}

export async function getStaticPaths() {
  return { paths: ['/activity'], fallback: false }
}
export async function getStaticProps() {
  const cwd = process.cwd()
  const { data, dataWithoutDiffs, dataPerDate } = await getListOfCommitsWithStats(
    '',
    '',
    join(cwd, 'notes'),
    join(cwd, 'notes', 'git'),
  )

  return { props: { log: dataPerDate } }
}

ActivityPage.getLayout = function getLayout(page: ReactElement) {
  return <ActivityLayout>{page}</ActivityLayout>
}
