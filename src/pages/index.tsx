import { Link as ChakraLink, Text, Code, List, ListIcon, ListItem, Flex } from '@chakra-ui/react'
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons'

import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { CTA } from '../components/CTA'
import { Footer } from '../components/Footer'
import React, { useEffect, useState } from 'react'

const getCommits = async () => {
  const dt = await fetch('https://api.github.com/repos/ThomasFKJorna/thesis-writings/commits', {
    method: 'GET',
    headers: { Accept: 'application/vnd.github.v3+json' },
  })
  const dtjs = await dt.json()
  return dtjs
}

const getCommitInfo = async (data: any) => {
  const commits = data.map(async (commit: any) => {
    try {
      return await fetch(
        `https://api.github.com/repos/ThomasFKJorna/thesis-writings/git/commits/${commit.sha}`,
        {
          method: 'GET',
          headers: { Accept: 'application/vnd.github.v3+json' },
        },
      ).then((res) => res.json())
    } catch (e) {
      return e
    }
  })
  await Promise.all(commits)
  return commits
}

const getBigData = async () => {
  const commits = await getCommits()
  const specificCommits = await getCommitInfo(commits)

  return { commits, specificCommits }
}

const Index = () => {
  const [data, setData] = useState<any>()
  useEffect(() => {
    if (!data) {
      getBigData().then((res) => setData(res))
    }
    return () => {}
  }, [])

  const enumdata = data?.commits?.map((commit: any) => {
    return (
      <Flex justifyContent="space-between" key={commit.sha} width="80% ">
        <Text>{commit.commit.message}</Text>
        <Text>{commit.commit.author.date}</Text>
        <Text>{commit.sha}</Text>
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
      <DarkModeSwitch />
      <Footer>
        <Text>Next ❤️ Chakra</Text>
      </Footer>
      <CTA />
    </Container>
  )
}

export default Index
