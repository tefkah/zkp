import { Text, Box, Container, useColorMode, Flex, VStack, HStack, Button } from '@chakra-ui/react'
import { join } from 'path'
import React, { useState } from 'react'
import Header from '../../components/Header'
import { readFileSync } from 'fs'
import { getListOfCommitsWithStats } from '../../utils/getListOfCommitsWithStats'
import { CommitList } from '../../components/Commits/CommitList'
import { CommitPerDateLog, DateCommit } from '../../api'
import { HistoryGraph } from '../../components/HistoryGraph'
import Link from 'next/link'
import Footer from '../../components/Footer'

export interface SlimCommit {
  oid: string
  message: string
  date: number
  additions: number
  deletions: number
  files: any[]
}

interface HistoryPageProps {
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

export default function HistoryPage(props: HistoryPageProps) {
  const { log } = props
  const [diffs, setDiffs] = useState()
  const theme = useColorMode()
  const dark = theme.colorMode === 'dark'
  const reverseLogValues = Object.values(log).reverse()
  return (
    <>
      <Header />
      <VStack justifyContents="center" spacing={6} mt={20}>
        <HStack spacing={2}>
          <Link
            prefetch={false}
            href={`/compare/${findCommitXDaysAgo(reverseLogValues, 7)}/${
              reverseLogValues[0].lastOid
            }`}
          >
            Last week
          </Link>
          <Link
            href={`/compare/${findCommitXDaysAgo(reverseLogValues, 30)}/${
              reverseLogValues[0].lastOid
            }`}
            prefetch={false}
          >
            Last month
          </Link>
        </HStack>
        <Box w="80%" height={100} backgroundColor={dark ? 'gray.800' : 'gray.50'}>
          <HistoryGraph data={log} dark={dark} diffs={diffs} setDiffs={setDiffs} />
        </Box>
      </VStack>
      <Box mx={{ base: '5%', md: '15%' }} my={20}>
        <CommitList commitLog={log} />
      </Box>
      <Footer />
    </>
  )
}

export async function getStaticPaths() {
  return { paths: ['/history'], fallback: false }
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
