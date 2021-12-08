import { StarIcon } from '@chakra-ui/icons'
import { Box, Flex, Icon, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { CommitPerDateLog, DateCommit, SlimCommit } from '../../api'
import { CommitListByDate } from './CommitListByDate'
import { BsRecordCircle } from 'react-icons/bs'
import { format, parse } from 'date-fns'

interface CommitListProps {
  commitLog: CommitPerDateLog
}

export const CommitList = (props: CommitListProps) => {
  const { commitLog } = props
  const [compair, setCompair] = useState<string[]>([])
  const commits = Object.entries(commitLog).reverse()

  const backgroundC = useColorModeValue('white', 'gray.800')
  return (
    <VStack spacing={0}>
      {commits.map((commitObj: [string, DateCommit]) => {
        const [date, totalCommit] = commitObj
        const commitList = totalCommit.commits

        const niceDate = format(parse(date, 'yyyy-MM-dd', new Date()), 'MMMM do, yyyy')
        return (
          <VStack
            pb={10}
            pl={10}
            display="flex"
            alignItems="flex-start"
            borderLeftColor="grey.600"
            borderLeftWidth={1}
            borderLeftStyle="solid"
            w="80%"
            key={niceDate}
          >
            <Flex ml={-12} alignItems="center" mb={2}>
              <Box backgroundColor={backgroundC} pt={1} pb={2}>
                <Icon as={BsRecordCircle} color="gray.500" />
              </Box>
              <Text fontWeight="semibold" size="xs" color="gray.400" ml={12}>
                {niceDate}
              </Text>
            </Flex>
            <CommitListByDate commits={commitList} {...{ compair, setCompair }} />
          </VStack>
        )
      })}
    </VStack>
  )
}
