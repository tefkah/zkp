import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
  Flex,
  Button,
  useColorMode,
  Box,
  Spinner,
} from '@chakra-ui/react'
import { Point, ResponsiveLine } from '@nivo/line'
import { BasicTooltip } from '@nivo/tooltip'
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons'
import { add, format, parseISO } from 'date-fns'

import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import React, { useEffect, useMemo, useState } from 'react'
import { fetchDiff } from '../server/gitlab'
import useSWR from 'swr'
import useFetch from '../utils/useFetch'
import fetcher from '../utils/fetcher'
import { TestOrg } from '../components/TestOrg'
import { getListOfCommitsWithStats } from '../utils/getListOfCommitsWithStats'
import { Commit } from '../api'
import { join } from 'path'
import Nav from '../components/Nav'
import Shell from '../components/Shell'
import Header from '../components/Header'
import Sidebar from '../components/SideBar'
import { HistoryGraph } from '../components/HistoryGraph'

export interface Committ {
  id: string
  short_id: string
  created_at: string
  parent_ids: any[]
  title: string
  message: string
  author_name: string
  author_email: string
  authored_date: string
  committer_name: string
  committer_email: string
  committed_date: string
  trailers: any
  web_url: string
  stats: Stats
}

interface Stats {
  additions: number
  deletions: number
  total: number
}

/* const getCommitInfo = async (data: any) => {
  const commits = data.map(async (commit: any) => {
    try {
      return await fetch(
        'https://gitlab.com/api/v4/projects/thomasfkjorna%2fthesis-writing/commits',
      ).then((res) => res.json())
    } catch (e) {
      return e
    }
  })
  await Promise.all(commits)
  console.log(commits)
  return commits
} */

/* const getBigData = async () => {
  const commits = await getCommits()
  const specificCommits = await getCommitInfo(commits)

  return { commits, specificCommits }
} */

export interface Diff {
  commit1: string
  commit2: string
}

export interface CommitDatum {
  message: string
  y: number
  x: Date
  id: string
}

export type GitPerDate = {
  [date: string]: DateCommit
}

interface DateCommit {
  totalAdditions: number
  totalDeletions: number
  lastDate: number
  lastOid: string
  lastMessage: string
  commits: SubDateCommit[]
}

interface SubDateCommit {
  oid: string
  message: string
  date: number
  files: any[]
  additions: number
  deletions: number
}

const glCommits =
  'https://gitlab.com/api/v4/projects/thomasfkjorna%2fthesis-writing/repository/commits?with_stats=true&per_page=200'

const Index = (props: { [key: string]: GitPerDate }) => {
  //const [data, setData] = useState<Commit[]>()
  const [diffs, setDiffs] = useState<Diff>({ commit1: '', commit2: '' })
  const [comparison, setComparison] = useState<any>()

  const { dataPerDate } = props
  const data = dataPerDate

  //console.log(data)
  useEffect(() => {
    if (diffs.commit1 && diffs.commit2) {
      const diffBoys = <TestOrg {...{ commit1: diffs.commit1, commit2: diffs.commit2 }} />
      console.log(diffBoys)
      setComparison(diffBoys)
      setDiffs({ commit1: '', commit2: '' })
      return
    }
  }, [diffs])

  const { colorMode } = useColorMode()
  const dark = colorMode === 'dark'

  return (
    <Box height="100vh">
      <Header />
      <Box
        //pt={20}
        //     padding="5rem 0"
        //     flex="1"
        //     display="flex"
        //     flexDirection="column"
        //     justifyContent="center"
        //     alignItems="center"
        w="full"
        //      w="full"
        //pb="12"
        // pt="3"
        // mx="auto"
      >
        <Box flexDir="row" display={{ base: 'block', md: 'flex' }}>
          <Sidebar />
          {/* <Hero title="My cool thesis" /> */}
          <Container
            style={{ flex: 1 }}
            display="flex"
            flexDir="column"
            justifyContent="space-between"
            w="70vw"
            //overflow="scroll"
          >
            <Container // overflow="scroll"
            //  maxH="90vh"
            //  pt={10}
            >
              {comparison || <Text>'Select some commits to see the comparison!'</Text>}
            </Container>
            <Box pos="fixed" bottom={0} bg={dark ? 'gray.600' : 'gray.100'} h={50} w="70vw">
              <HistoryGraph {...{ dark, diffs, setDiffs, data }} />
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

export default Index

// Next.js pre-renders a page on each request if async `getServerSideProps` is exported from that page.
// 👀 https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getStaticProps() {
  // const commits = await fetcher(glCommits)
  const cwd = process.cwd()
  const { data, dataWithoutDiffs, dataPerDate } = await getListOfCommitsWithStats(
    '',
    '',
    join(cwd, 'notes'),
    join(cwd, 'notes', 'git'),
  )

  return { props: { dataPerDate } }
}
