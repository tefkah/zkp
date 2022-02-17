import { StarIcon } from '@chakra-ui/icons'
import { Box, Flex, Icon, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { CommitPerDateLog, DateCommit, SlimCommit } from '../../lib/api'
import { CommitListByDate } from './CommitListByDate'
import { BsRecordCircle } from 'react-icons/bs'
import { format, parse } from 'date-fns'

interface CommitListProps {
  commitLog: CommitPerDateLog
  slim?: boolean
}

export const CommitList = (props: CommitListProps) => {
  const { commitLog, slim } = props
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
            pb={{ base: slim ? 1 : 4, md: slim ? 4 : 10 }}
            pl={{ base: slim ? 0 : 4, md: slim ? 0 : 10 }}
            display="flex"
            alignItems="flex-start"
            borderLeftColor="grey.600"
            borderLeftWidth={slim ? 0 : 1}
            borderLeftStyle="solid"
            w={slim ? 'full' : 'full'}
            key={niceDate}
          >
            <Flex ml={{ base: slim ? 0 : -6, md: slim ? 0 : -12 }} alignItems="center" mb={2}>
              {!slim && (
                <Box backgroundColor={backgroundC} pt={1} pb={2}>
                  <Icon as={BsRecordCircle} color="gray.500" />
                </Box>
              )}
              <Text
                fontWeight="semibold"
                fontSize="xs"
                color="gray.400"
                ml={{ base: slim ? 0 : 6, md: slim ? 0 : 12 }}
              >
                {niceDate}
              </Text>
            </Flex>
            <CommitListByDate commits={commitList} {...{ slim, compair, setCompair }} />
          </VStack>
        )
      })}
    </VStack>
  )
}
