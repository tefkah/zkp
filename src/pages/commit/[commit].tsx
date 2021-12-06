import { getCommits, tryReadJSON } from '../../utils/getListOfCommitsWithStats'
import { Commit } from '../../api'
import { Box, Container, Flex, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ParsedDiff from '../../server/parseDiff'
import useFetch from '../../utils/useFetch'
import { commit } from 'isomorphic-git'
import { DiffBox } from '../../components/DiffBox'
import { join } from 'path'

export function parseCommits(commitData: Commit) {
  return commitData?.files?.map((file) => {
    if (!file) return
    const { additions, deletions, filepath, oid } = file
    const orgText = ParsedDiff({ diff: file, truncated: true })
    return (
      <DiffBox key={file.filepath} {...{ oid, filepath, deletions, additions }}>
        {orgText}
      </DiffBox>
    )
  })
}

interface Props {
  commitData: Commit
}
export default function AAAA(props: Props) {
  const { commitData } = props
  const { oid, deletions, additions, message, date } = commitData

  //const {data:parsedText, isLoading} = useFetch(e)

  const parsedText = parseCommits(commitData)

  return (
    <Container>
      <Text>this should be a static page, which shows all the files CHANGED at this commit.</Text>
      <Text>
        Each of the files at this commit should be a file which shows the differences between this
        commit and the last.
      </Text>
      <Text>
        There should also be an option to view ALL the files at this commit, but this should not be
        static (would be too much to keep track of, not worth it.
      </Text>
      <Text>Actually, I don't see anyone really use that, we don't need that.</Text>
      <Flex justifyContent="space-between">
        <Flex flexDir="column">
          <Text>{message}</Text>
          <Text>{`Commit ${oid}`}</Text>
          <Text>{new Date(date * 1000).toLocaleString()}</Text>
        </Flex>
        <Text mx={3} color="red.500">{`-${deletions}`}</Text>
        <Text color="green.500">{`+${additions}`}</Text>
      </Flex>
      <Box>{parsedText ?? <Spinner />}</Box>
    </Container>
  )
}

export async function getStaticPaths() {
  const commitList = await getCommits()
  const commitIndexList = commitList.map((commit) => ({ params: { commit: commit.oid } }))
  return {
    paths: commitIndexList,
    fallback: false,
  }
}

export interface StaticProps {
  params: { commit: string }
}
export async function getStaticProps(props: StaticProps) {
  const { commit } = props.params

  const cwd = process.cwd()
  const commits = await tryReadJSON(join(cwd, 'data', 'git.json'))
  //const commits = await tryReadJSON('data/git.json')

  const commitData =
    commits.filter((c: Commit) => {
      return c.oid === commit
    })?.[0] || {}

  return { props: { commitData } }
}
