import React from 'react'
import { Divider, VStack } from '@chakra-ui/layout'
import { Commit } from './Commit'
import { SlimCommit } from '../../types'

interface Props {
  commits: SlimCommit[]
  compair: string[]
  setCompair: (compair: string[]) => void
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
      {reversedCommits.map((commit: SlimCommit) => (
        <Commit {...{ ...commit, slim, compair, setCompair }} key={commit.oid} />
      ))}
    </VStack>
  )
}

CommitListByDate.defaultProps = { slim: false }
