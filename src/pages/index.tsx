import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
  Flex,
  Button,
} from '@chakra-ui/react'
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons'

import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { CTA } from '../components/CTA'
import { Footer } from '../components/Footer'
import React, { useEffect, useState } from 'react'
import { fetchDiff } from '../api/gitlab'

const getCommits = async () => {
  const dt = await fetch(
    'https://gitlab.com/api/v4/projects/thomasfkjorna%2fthesis-writings/repository/commits',
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

const Index = () => {
  const [data, setData] = useState<any>()
  const [diffs, setDiffs] = useState<Diff>({ commit1: '', commit2: '' })
  const [comparison, setComparison] = useState('')

  useEffect(() => {
    if (!data) {
      getCommits().then((res) => setData(res))
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

  const compareDiffs = (diff: string, commits: any) => {
    if (!diff) {
      setDiffs({ commit1: '', commit2: '' })
      return
    }
    const commitList = commits.map((commit: any) => commit.sha)
    if (diffs?.commit1) {
      setDiffs((curr: any) => ({ ...curr, commit2: diff }))
      return
    }
    setDiffs({ commit1: diff, commit2: '' })
    return
  }

  const enumdata = data?.map((commit: any) => {
    return (
      <Flex justifyContent="space-between" key={commit.sha} width="80% ">
        <Text>{commit.message}</Text>
        <Text>{commit.created_at}</Text>
        <Text>{commit.id}</Text>
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
  return (
    <Container height="100vh">
      <Hero title="Somehow a philosophy thesis" />
      <Main>
        <Text>Testing fetching</Text>
      </Main>

      {enumdata}
      <Container>
        <Text>{comparison || 'Select some commits to see the comparison1'}</Text>
      </Container>
      <DarkModeSwitch />
      <Footer>
        <Text>Next ❤️ Chakra</Text>
      </Footer>
      <CTA />
    </Container>
  )
}

export default Index
