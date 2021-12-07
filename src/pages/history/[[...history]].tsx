import { Text, Box, Container } from '@chakra-ui/react'
import { join } from 'path'
import React from 'react'
import Header from '../../components/Header'
import { readFileSync } from 'fs'
import { getListOfCommitsWithStats } from '../../utils/getListOfCommitsWithStats'
import { CommitList } from '../../components/Commits/CommitList'
import { CommitPerDateLog } from '../../api'

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
  return (
    <>
      <Header />
      <Box mt={10}>
        <Text>GRAPH</Text>
      </Box>
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
  console.log(data)

  return { props: { log: dataPerDate } }
}
