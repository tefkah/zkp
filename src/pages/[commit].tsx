import { getCommits, tryReadJSON } from '../utils/getListOfCommitsWithStats'
import { Commit } from '../api'
import { Box, Container, Flex, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ParsedDiff from '../server/parseDiff'
import useFetch from '../utils/useFetch'
import { commit } from 'isomorphic-git'
import { DiffBox } from '../components/DiffBox'

export async function parseCommits(commitData: Commit) {
  const parsedCommits = []

  for (let i = 0; i < commitData.files.length; i++) {
    const file = commitData.files[i]

    const { additions, deletions, filepath, oid } = file
    const orgText = await ParsedDiff({ diff: file, truncated: true })
    parsedCommits.push(
      <DiffBox key={file.filepath} {...{ oid, filepath, deletions, additions }}>
        {orgText}
      </DiffBox>,
    )
  }
  return parsedCommits
}

interface Props {
  commitData: Commit
}
export default function AAAA(props: Props) {
  const { commitData } = props
  const { oid, deletions, additions, message, date } = commitData
  const [parsedText, setParsedText] = useState<any[]>([])
  //const {data:parsedText, isLoading} = useFetch(e)

  const parsedCommits = parseCommits(commitData)
  useEffect(() => {
    ;(async () => {
      const coms = await parsedCommits
      if (!coms.length) {
        setParsedText([])
        return
      }
      console.log(coms)
      setParsedText(coms)
    })()
  }, [])

  return (
    <Container>
      <p>this should be a static page, which shows all the files CHANGED at this commit.</p>
      <p>
        Each of the files at this commit should be a file which shows the differences between this
        commit and the last.
      </p>
      <p>
        There should also be an option to view ALL the files at this commit, but this should not be
        static (would be too much to keep track of, not worth it.
      </p>
      <Flex flexDir="column">
        <Text>{`Commit ${oid}`}</Text>
        <Text>{new Date(date * 1000).toLocaleString()}</Text>
      </Flex>
      <div>{parsedText ?? <Spinner />}</div>
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

export async function getStaticProps({ params }) {
  const { commit } = params
  const commits = await tryReadJSON('data/git.json')

  const commitData =
    commits.filter((c: Commit) => {
      return c.oid === commit
    })?.[0] || {}

  return { props: { commitData } }
}
