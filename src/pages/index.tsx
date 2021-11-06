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
} from '@chakra-ui/react'
import { AxisOptions, Chart, Datum } from 'react-charts'
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons'

import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { CTA } from '../components/CTA'
import { Footer } from '../components/Footer'
import React, { useEffect, useMemo, useState } from 'react'
import { fetchDiff } from '../api/gitlab'

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
      'https://gitlab.com/ThomasFKJorna/thesis-writings/-/commit/d655814be4a0c8ad5128fc6dd0c26b82be8d49f1',
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
      'https://gitlab.com/ThomasFKJorna/thesis-writings/-/commit/3b01166ffed669d6c900cf5e4176a54132f05cf0',
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
      'https://gitlab.com/ThomasFKJorna/thesis-writings/-/commit/979651681530eb4d5381d4d6ff46b406c839a105',
    stats: {
      additions: 276,
      deletions: 0,
      total: 276,
    },
  },
]

const getCommits = async () => {
  const dt = await fetch(
    'https://gitlab.com/api/v4/projects/thomasfkjorna%2fthesis-writings/repository/commits?with_stats=true',
  )
  const dtjs = await dt.json()
  return dtjs
}

const getCommitInfo = async (data: any) => {
  const commits = data.map(async (commit: any) => {
    try {
      return await fetch(
        'https://gitlab.com/api/v4/projects/thomasfkjorna%2fthesis-writings/commits',
      ).then((res) => res.json())
    } catch (e) {
      return e
    }
  })
  await Promise.all(commits)
  console.log(commits)
  return commits
}

const getBigData = async () => {
  const commits = await getCommits()
  const specificCommits = await getCommitInfo(commits)

  return { commits, specificCommits }
}

export interface Diff {
  commit1: string
  commit2: string
}

export interface CommitDatum {
  message: string
  data: number
  date: string
  id: string
}

const Index = () => {
  const [data, setData] = useState<typeof babyData>()
  const [diffs, setDiffs] = useState<Diff>({ commit1: '', commit2: '' })
  const [comparison, setComparison] = useState('')

  useEffect(() => {
    if (!data) {
      getCommits().then((res) => {
        console.log(res)
        setData(res)
      })
    }
    return () => {}
  }, [data])

  useEffect(() => {
    if (diffs.commit1 && diffs.commit2) {
      fetchDiff('ThomasFKJorna/thesis-writings', diffs.commit1, diffs.commit2).then((res) => {
        console.log(res)

        setDiffs({ commit1: '', commit2: '' })
        if (!res.error) {
          const comps = res.diffs.map((diff: any, i: number) => {
            return <Text key={i}> {diff.diff}</Text>
          })
          setComparison(comps)
          return
        }

        setComparison('whoopie')
        return
      })
    }
  }, [diffs])

  const commitChartData = useMemo(() => {
    if (!data) {
      return [
        { label: 'Additions', data: [] },
        { label: 'Deletions', data: [] },
      ]
    }
    const adds = data.map((commit: any) => {
      return {
        message: commit.message,
        data: commit.stats.additions,
        date: commit.authored_date,
        id: commit.id,
      }
    })
    const dels = data.map((commit: any) => {
      return {
        message: commit.message,
        data: commit.stats.deletions,
        date: commit.authored_date,
        id: commit.id,
      }
    })
    return [
      { label: 'Additions', data: adds },
      { label: 'Deletions', data: dels },
    ]
  }, [data])

  const primaryAxis = useMemo(
    (): AxisOptions<CommitDatum> => ({
      getValue: (datum) => Date.parse(datum.date) as unknown as Date,
      scaleType: 'localTime',
    }),
    [],
  )

  const secondaryAxes = useMemo(
    (): AxisOptions<CommitDatum>[] => [
      {
        getValue: (datum) => datum.data,
        elementType: 'area',
      },
    ],
    [],
  )

  const compareDiffs = (diff: string | undefined, commits: any) => {
    if (!diff) {
      setDiffs({ commit1: '', commit2: '' })
      return
    }
    const commitList = commits.map((commit: any) => commit.id)
    // the gitlab api needs the commits to be in chronological order
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
  const clickDatumHandler = (
    datum: Datum<CommitDatum> | null,
    event: React.MouseEvent<SVGSVGElement, MouseEvent> | undefined,
  ): void => {
    console.log(datum)
    compareDiffs(datum?.originalDatum?.id, datum?.originalSeries.data)
  }

  const enumdata = data?.map((commit: any) => {
    return (
      <Flex h={50} justifyContent="space-between" key={commit.sha} width={500}>
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
  })

  const { colorMode } = useColorMode()
  return (
    <Container>
      <Hero title="Somehow a philosophy thesis" />
      <Main>
        <Text>Testing fetching</Text>
      </Main>
      <Container w={400} overflow="scroll">
        {enumdata}
      </Container>
      <Container maxH={200} overflow="scroll" maxW="100vh">
        <Text>{comparison || 'Select some commits to see the comparison1'}</Text>
      </Container>
      <Container maxH="70vh">
        {data && (
          <Chart
            options={{
              primaryAxis: primaryAxis,
              secondaryAxes: secondaryAxes,
              data: commitChartData,
              onClickDatum: clickDatumHandler,
              dark: colorMode === 'dark',
            }}
          />
        )}
      </Container>
      <DarkModeSwitch />
    </Container>
  )
}
export default Index
