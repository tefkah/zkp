import { Text, Box, Container, useColorMode, Flex, VStack } from '@chakra-ui/react'
import { join } from 'path'
import React, { useState } from 'react'
import Header from '../../components/Header'
import { readFileSync } from 'fs'
import { getListOfCommitsWithStats } from '../../utils/getListOfCommitsWithStats'
import { CommitList } from '../../components/Commits/CommitList'
import { CommitPerDateLog } from '../../api'
import { HistoryGraph } from '../../components/HistoryGraph'

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

export default function HistoryPage(props: HistoryPageProps) {
  const { log } = props
  const [diffs, setDiffs] = useState()
  const theme = useColorMode()
  const dark = theme.colorMode === 'dark'
  return (
    <>
      <Header />
      <VStack justifyContents="center" mt={20}>
        <Box w="80%" height={100} backgroundColor={dark ? 'gray.800' : 'gray.50'}>
          <HistoryGraph data={log} dark={dark} diffs={diffs} setDiffs={setDiffs} />
        </Box>
      </VStack>
      <CommitList commitLog={log} />
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
