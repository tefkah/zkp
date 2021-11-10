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
import { ResponsiveLine } from '@nivo/line'
import { BasicTooltip } from '@nivo/tooltip'
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons'
import { format, parseISO } from 'date-fns'

import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { CTA } from '../components/CTA'
import { Footer } from '../components/Footer'
import React, { useEffect, useMemo, useState } from 'react'
import { fetchDiff } from '../server/gitlab'
import useSWR from 'swr'
import useFetch from '../utils/useFetch'
import fetcher from '../utils/fetcher'
import { TestOrg } from '../components/testOrg'

const babyData = [
  {
    id: 'd655814be4a0c8ad5128fc6dd0c26b82be8d49f1',
    short_id: 'd655814b',
    created_at: '2021-11-04T15:14:35.000+01:00',
    parent_ids: ['3b01166ffed669d6c900cf5e4176a54132f05cf0'],
    title: 'Create README.org',
    message: 'Create README.org',
    author_name: 'Thomas F. K. Jorna',
    author_email: 'hello@tefkah.com',
    authored_date: '2021-11-04T15:14:35.000+01:00',
    committer_name: 'GitHub',
    committer_email: 'noreply@github.com',
    committed_date: '2021-11-04T15:14:35.000+01:00',
    trailers: {},
    web_url:
      'https://gitlab.com/ThomasFKJorna/thesis-writing/-/commit/d655814be4a0c8ad5128fc6dd0c26b82be8d49f1',
    stats: {
      additions: 15,
      deletions: 0,
      total: 15,
    },
  },
  {
    id: '3b01166ffed669d6c900cf5e4176a54132f05cf0',
    short_id: '3b01166f',
    created_at: '2021-11-04T14:55:13.000+01:00',
    parent_ids: ['979651681530eb4d5381d4d6ff46b406c839a105'],
    title: 'meta: add CC license',
    message: 'meta: add CC license',
    author_name: 'Thomas F. K. Jorna',
    author_email: 'hello@tefkah.com',
    authored_date: '2021-11-04T14:55:13.000+01:00',
    committer_name: 'GitHub',
    committer_email: 'noreply@github.com',
    committed_date: '2021-11-04T14:55:13.000+01:00',
    trailers: {},
    web_url:
      'https://gitlab.com/ThomasFKJorna/thesis-writing/-/commit/3b01166ffed669d6c900cf5e4176a54132f05cf0',
    stats: {
      additions: 173,
      deletions: 0,
      total: 173,
    },
  },
  {
    id: '979651681530eb4d5381d4d6ff46b406c839a105',
    short_id: '97965168',
    created_at: '2021-11-04T14:51:34.000+01:00',
    parent_ids: [],
    title: 'Initial commit',
    message: 'Initial commit',
    author_name: 'Thomas F. K. Jorna',
    author_email: 'hello@tefkah.com',
    authored_date: '2021-11-04T14:51:34.000+01:00',
    committer_name: 'GitHub',
    committer_email: 'noreply@github.com',
    committed_date: '2021-11-04T14:51:34.000+01:00',
    trailers: {},
    web_url:
      'https://gitlab.com/ThomasFKJorna/thesis-writing/-/commit/979651681530eb4d5381d4d6ff46b406c839a105',
    stats: {
      additions: 276,
      deletions: 0,
      total: 276,
    },
  },
]
const singleComm = {
  id: '979651681530eb4d5381d4d6ff46b406c839a105',
  short_id: '97965168',
  created_at: '2021-11-04T14:51:34.000+01:00',
  parent_ids: [],
  title: 'Initial commit',
  message: 'Initial commit',
  author_name: 'Thomas F. K. Jorna',
  author_email: 'hello@tefkah.com',
  authored_date: '2021-11-04T14:51:34.000+01:00',
  committer_name: 'GitHub',
  committer_email: 'noreply@github.com',
  committed_date: '2021-11-04T14:51:34.000+01:00',
  trailers: {},
  web_url:
    'https://gitlab.com/ThomasFKJorna/thesis-writing/-/commit/979651681530eb4d5381d4d6ff46b406c839a105',
  stats: {
    additions: 276,
    deletions: 0,
    total: 276,
  },
}
export interface Commit {
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

const glCommits =
  'https://gitlab.com/api/v4/projects/thomasfkjorna%2fthesis-writing/repository/commits?with_stats=true&per_page=200'

const Index = (props: { [key: string]: string }) => {
  //const [data, setData] = useState<Commit[]>()
  const [diffs, setDiffs] = useState<Diff>({ commit1: '', commit2: '' })
  const [comparison, setComparison] = useState<any>()

  const { commits } = props
  const { data, isLoading } = useFetch(glCommits, { fallback: commits })

  useEffect(() => {
    if (diffs.commit1 && diffs.commit2) {
      console.log('hi')
      const diffBoys = <TestOrg commit1={diffs.commit1} commit2={diffs.commit2} />
      console.log(diffBoys)
      setComparison(diffBoys)
      setDiffs({ commit1: '', commit2: '' })
      return
    }
    //setComparison(<Text>aaaa</Text>)
    //return
    //   fetchDiff('ThomasFKJorna/thesis-writing', diffs.commit1, diffs.commit2).then((res) => {
    //     console.log(res)

    //     if (!res.error) {
    //       const comps = res.diffs.map((diff: any, i: number) => {
    //         return <Text key={i}> {diff.diff}</Text>
    //       })
    //     }

    //     setComparison('whoopie')
    //     return
    //   })
    // }
  }, [diffs])

  const commitChartData = useMemo(() => {
    if (isLoading) {
      return [
        { id: 'Additions', data: [] },
        { id: 'Deletions', data: [] },
      ]
    }
    const adds = data.map((commit: Commit): CommitDatum => {
      return {
        message: commit.message,
        y: commit.stats.additions,
        x: parseISO(commit.authored_date),
        id: commit.id,
      }
    })
    const dels = data.map((commit: Commit): CommitDatum => {
      return {
        message: commit.message,
        y: -commit.stats.deletions,
        x: parseISO(commit.authored_date),
        id: commit.id,
      }
    })
    return [
      { id: 'Additions', data: adds },
      { id: 'Deletions', data: dels },
    ]
  }, [data])

  const compareDiffs = (diff: string | undefined, commits: Commit[] | undefined = data) => {
    if (!commits || !diff) {
      setDiffs({ commit1: '', commit2: '' })
      return
    }

    const commitList = commits.map((commit: Commit | CommitDatum) => commit.id) // the gitlab api needs the commits to be in chronological order
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

  const onClickHandler = (point: any, event: any): void => {
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
  return (
    <Container h="100vh" overflow="scroll">
      <Hero title="My cool thesis" />

      <Main>
        <Text>Testing fetching</Text>
        <Container h={200}>
          {isLoading ? (
            <Spinner />
          ) : (
            <ResponsiveLine
              data={commitChartData}
              //xFormat={(x) => format(x, 'MMMM dd')}
              isInteractive
              useMesh
              curve="monotoneX"
              enableArea
              enableGridX={false}
              enableGridY={false}
              yScale={{ min: -500, max: 'auto', type: 'linear' }}
              xScale={{ type: 'time' }}
              axisBottom={{
                format: '%b %d',
                tickValues: 'every 2 days',
                legend: 'time scale',
                legendOffset: -12,
              }}
              crosshairType="x"
              onClick={onClickHandler}
              //enableSlices={'x'}
              tooltip={({ point }) => {
                const node = point.data as unknown as CommitDatum
                return (
                  <BasicTooltip
                    id={
                      <Box>
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
                      </Box>
                    }
                  ></BasicTooltip>
                )
              }}
            />
          )}
        </Container>
      </Main>
      <Container maxW="80vw">
        <Text>{comparison || 'Select some commits to see the comparison!'}</Text>
      </Container>
      <DarkModeSwitch />
    </Container>
  )
}

export default Index

// Next.js pre-renders a page on each request if async `getServerSideProps` is exported from that page.
// 👀 https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps() {
  const commits = await fetcher(glCommits)

  return { props: { commits } }
}
