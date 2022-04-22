import React from 'react'
import { Commit } from './Commit'
import { SlimCommit } from '../../lib/api'
import { Container, Divider, VStack } from '@chakra-ui/layout'

interface Props {
  commits: SlimCommit[]
  compair: string[]
  setCompair: any
  slim?: boolean
}

export const CommitListByDate = (props: Props) => {
  const { commits, compair, setCompair, slim } = props
  const reversedCommits = JSON.parse(JSON.stringify(commits)).reverse()
  return (
    <VStack
      py={slim ? 0 : 3}
      borderRadius={slim ? 0 : 'lg'}
      borderColor="grey.700"
      borderWidth={slim ? 0 : 1}
      divider={<Divider color="gray.500" />}
      spacing={2}
      w="100%"
      display="flex"
      alignItems="flex-start"
    >
      {reversedCommits.map((commit: SlimCommit) => {
        return <Commit {...{ ...commit, slim, compair, setCompair }} key={commit.oid} />
      })}
    </VStack>
  )
}
