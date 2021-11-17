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
import { TestOrg } from '../components/testOrg'
import { getListOfCommitsWithStats } from '../utils/getListOfCommitsWithStats'
import { Commit } from '../api'
import { join } from 'path'
import Nav from '../components/Nav'
import Shell from '../components/Shell'
import Header from '../components/Header'
import Sidebar from '../components/SideBar'

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
  const { data, isLoading } = { data: dataPerDate, isLoading: false } //useFetch(glCommits, { fallback: commits })

  console.log(data)
  useEffect(() => {
    if (diffs.commit1 && diffs.commit2) {
      const diffBoys = <TestOrg commit1={diffs.commit1} commit2={diffs.commit2} />
      setComparison(diffBoys)
      setDiffs({ commit1: '', commit2: '' })
      return
    }
  }, [diffs])

  const commitChartData = useMemo(() => {
    if (isLoading) {
      console.log('aaaaaa no data ')
      return [
        { id: 'Additions', data: [] },
        { id: 'Deletions', data: [] },
      ]
    }
    const [adds, dels] = ['additions', 'deletions'].map((a) =>
      Object.entries(data).map((entry: Array<string | DateCommit>): CommitDatum => {
        const date = entry[0] as string
        const commit = entry[1] as DateCommit
        return {
          message: commit.lastMessage,
          y: a === 'additions' ? commit.totalAdditions : -commit.totalDeletions,
          x: parseISO(`${date}T12:00:00.000Z`),
          id: commit.lastOid,
        }
      }),
    )

    return [
      {
        id: 'Additions',
        data: adds,
      },
      { id: 'Deletions', data: dels },
    ]
  }, [data])

  const compareDiffs = (
    diff: string | undefined,
    commits: DateCommit[] | undefined = Object.values(data),
  ) => {
    if (!commits || !diff) {
      setDiffs({ commit1: '', commit2: '' })
      return
    }

    const commitList = commits.map((commit: DateCommit) => commit.lastOid).reverse() // the gitlab api needs the commits to be in chronological order
    // in order to compare the commits
    if (diffs?.commit1) {
      const compareObj =
        commitList.indexOf(diff) > commitList.indexOf(diffs.commit1)
          ? { commit1: diff, commit2: diffs.commit1 }
          : { commit1: diffs.commit1, commit2: diff }
      setDiffs(compareObj)
      return
    }
    setDiffs({ commit1: diff, commit2: '' })
    return
  }

  const onClickHandler = (point: Point, event: any): void => {
    if (!point) {
      return
    }
    console.log(point)
    const data = point?.data as unknown as CommitDatum
    console.log(data)
    compareDiffs(data?.id!)
    // compareDiffs(datum?.originalDatum?.id, datum?.originalSeries.data)
  }

  /*   const enumdata = data?.map((commit: Commit) => {
    return (
      <Flex h={50} justifyContent="space-between" key={commit.id} width={500}>
        <Text>{commit.message}</Text>
        <Text>{commit.created_at}</Text>
        <Text color="green.500">{commit.stats.additions}</Text>
        <Text color="red.500">{commit.stats.deletions}</Text>
        <Button
          onClick={() =>
            diffs?.commit1 === commit.id ? compareDiffs('', data) : compareDiffs(commit.id, data)
          }
        >
          {diffs?.commit1 === commit.id ? 'Cancel' : 'Compare'}
        </Button>
      </Flex>
    )
  }) */

  const { colorMode } = useColorMode()
  const dark = colorMode === 'dark'
  return (
    <>
      <Header />
      <Box
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
          >
            <Container>
              <Text>{comparison || 'Select some commits to see the comparison!'}</Text>
            </Container>
            <Box bg={dark ? 'gray.600' : 'gray.100'} h={50} w="70vw">
              {isLoading ? (
                <Spinner />
              ) : (
                <ResponsiveLine
                  margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  data={commitChartData}
                  // xFormat={(x) => format(x, 'MMMM dd')}
                  isInteractive
                  useMesh
                  curve="monotoneX"
                  enableArea
                  //enableGridX={false}
                  enableGridY={false}
                  yScale={{ min: -500, max: 'auto', type: 'linear' }}
                  xScale={{ type: 'time' }}
                  axisBottom={{
                    format: (value: Date) => value.toISOString(),
                    tickValues: 'every 2 days',
                  }}
                  crosshairType="x"
                  onClick={onClickHandler}
                  //enableSlices={'x'}
                  tooltip={({ point }) => {
                    const node = point.data as unknown as CommitDatum
                    return (
                      <Container
                        p={3}
                        borderRadius="md"
                        boxShadow="md"
                        bg={dark ? 'gray.600' : 'gray.100'}
                      >
                        <Text fontWeight="bold">
                          {node.message.slice(0, 8) === 'Scripted' ? 'Auto-commit' : node.message}
                        </Text>
                        <Text color="gray.400" fontSize={9}>{`${format(
                          node.x as Date,
                          'MMMM dd, hh:mm',
                        )}`}</Text>
                        {point.serieId === 'Additions' ? (
                          <>
                            <Text fontSize={12} color="green.500">{`+ ${node.y}`}</Text>
                            <Text fontSize={12} color="red.500">
                              {`- ${Math.abs(commitChartData[1]?.data?.[point?.index]?.y)}`}
                            </Text>
                          </>
                        ) : (
                          <>
                            <Text fontSize={12} color="green.500">{`+ ${
                              commitChartData[0].data[
                                point.index - commitChartData[0]?.data?.length
                              ]?.y
                            }`}</Text>
                            <Text fontSize={12} color="red.500">{`- ${Math.abs(node.y)}`}</Text>
                          </>
                        )}
                      </Container>
                    )
                  }}
                />
              )}
            </Box>
          </Container>
        </Box>
      </Box>
    </>
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
