import { Box, Text, Container, Heading, HStack, VStack } from '@chakra-ui/react'
import React from 'react'
import { ViewGithub } from '../Buttons/ViewGithub'
import { useGQL } from '../../hooks/useGQL'
import { nearestMilestone } from '../../queries/milestones'
import { isoToDateDistance } from '../../utils/parseTime'

interface Props {}

export interface Milestone {
  dueOn: string
  id: string
  progressPercentage: string
  updatedAt: string
  title: string
  state: string
  description: string
  number: string
  url: string
}

const Milestone = (props: Props) => {
  const { data, isLoading, error } = useGQL(nearestMilestone)
  const { dueOn, id, url, progressPercentage, updatedAt, title, state, description } = data
    ? data.data.repository.milestones.edges[0].node
    : ({} as Milestone)
  return (
    <>
      {!isLoading && (
        <Container borderWidth={1} borderRadius="sm" py={4}>
          <VStack w="full" alignItems="flex-start">
            <HStack justifyContent="space-between" alignItems="baseline">
              <Heading size="md">{title}</Heading>
              <Text>DUE: {isoToDateDistance(dueOn)}</Text>
            </HStack>
            <Text>{description}</Text>
            <HStack alignItems="center">
              <Text fontSize="xs" color="gray.500">
                {isoToDateDistance(updatedAt)}
              </Text>
              <Text>{state}</Text>
              <ViewGithub full slug={url} />
            </HStack>

            <Box overflow="hidden" borderWidth={1} borderRadius="md" w="full">
              <Box w={`${Math.max(1, parseInt(progressPercentage))}%`} height={2} bg="primary" />
            </Box>
          </VStack>
        </Container>
      )}
    </>
  )
}
export default Milestone
