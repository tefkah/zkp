import { StarIcon } from '@chakra-ui/icons'
import { Flex, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { CommitPerDateLog, DateCommit, SlimCommit } from '../../api'
import { CommitListByDate } from './CommitListByDate'
import { BsRecordCircle } from 'react-icons/bs'

interface CommitListProps {
  commitLog: CommitPerDateLog
}

export const CommitList = (props: CommitListProps) => {
  const { commitLog } = props
  const commits = Object.entries(commitLog).reverse()

  console.log(commits)
  return (
    <VStack>
      {commits.map((commitObj: [string, DateCommit]) => {
        const [date, totalCommit] = commitObj
        const commitList = totalCommit.commits

        return (
          <VStack
            pt={10}
            pl={10}
            display="flex"
            alignItems="flex-start"
            borderLeftColor="grey.600"
            borderLeftWidth={1}
            borderLeftStyle="solid"
            w="80%"
          >
            <Flex ml={-12} alignItems="center" mb={4}>
              <BsRecordCircle />
              <Text ml={4}>{date}</Text>
            </Flex>
            <CommitListByDate commits={commitList} />
          </VStack>
        )
      })}
    </VStack>
  )
}
