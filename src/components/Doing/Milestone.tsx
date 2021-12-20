import { Box, Text, Container, Heading, HStack, VStack, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { ViewGithub } from '../Buttons/ViewGithub'
import { useGQL } from '../../hooks/useGQL'
import { nearestMilestone } from '../../queries/milestones'
import { isoToDate, isoToDateDistance } from '../../utils/parseTime'
import { CalendarIcon } from '@chakra-ui/icons'
import { UpdatedAt } from './UpdatedAt'

interface Props {}

export interface MilestoneProps {
  dueOn: string
  id: string
  progressPercentage: string
  updatedAt: string
  title: string
  state: string
  description: string
  number: number
  url: string
}

const Milestone = (props: MilestoneProps) => {
  const { dueOn, id, url, progressPercentage, updatedAt, title, state, description } = props
  return (
    <Box>
      <Container py={4}>
        <VStack alignItems="flex-start">
          <VStack alignItems="flex-start">
            <HStack justifyContent="space-between" alignItems="baseline">
              <Heading size="lg">{title}</Heading>
            </HStack>

            <Box overflow="hidden" borderWidth={1} borderRadius="md" w="110%">
              <Box w={`${Math.max(1, parseInt(progressPercentage))}%`} height={2} bg="green.500" />
            </Box>

            <HStack spacing={4} alignItems="bottom" color="gray.500" fontWeight="500" fontSize="sm">
              <Tooltip label={isoToDate(dueOn)}>
                <HStack alignItems="center" spacing={2}>
                  <CalendarIcon />
                  <Text color="gray.500">Due {isoToDateDistance(dueOn)}</Text>
                </HStack>
              </Tooltip>
              <Text>{progressPercentage}% completed</Text>
            </HStack>
          </VStack>
          <Text>{description}</Text>
          <VStack alignItems="flex-start">
            <UpdatedAt {...{ updatedAt, url }} />
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}
export default Milestone
