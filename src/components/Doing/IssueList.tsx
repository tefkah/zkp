import {
  Box,
  Container,
  Divider,
  Heading,
  HStack,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { useGQL } from '../../hooks/useGQL'
import { issuesPerMilestone, nearestMilestoneWithIssues } from '../../queries/milestones'
import { isoToDate, isoToDateDistance } from '../../utils/parseTime'
import { ViewGithub } from '../Buttons/ViewGithub'
import { IssueLabels } from './Labels'
import Milestone from './Milestone'
import { IssueStatus } from './Status'
import { UpdatedAt } from './UpdatedAt'

interface MilestoneNode {
  dueOn: string
  id: string
  progressPercentage: string
  updatedAt: string
  title: string
  state: string
  description: string
  number: number
  url: string
  issues: Issues
}
interface NearestMilestoneData {
  data: {
    repository: {
      milestones: {
        edges: [
          {
            cursor: string
            node: MilestoneNode
          },
        ]
      }
    }
  }
}
interface IssueListProps {}
interface Edge {
  cursor: string
  node: Issue
}
interface Issue {
  id: string
  closed: boolean
  number: number
  title: string
  url: string
  updatedAt: string
  body: string
  labels: Labels
}
interface Issues {
  edges: Edge[]
}

export interface Labels {
  nodes: LabelNode[]
}

export interface LabelNode {
  color: string
  name: string
  description: string
}
const IssueList = (props: IssueListProps) => {
  const { data, isLoading, error }: { data: NearestMilestoneData; isLoading: boolean; error: any } =
    useGQL(nearestMilestoneWithIssues({ first: 100 }))

  const { issues, ...milestoneProps } = isLoading
    ? ({} as MilestoneNode)
    : data.data.repository.milestones.edges?.[0]?.node

  return (
    <>
      {!isLoading && (
        <VStack
          spacing={{ base: 5, md: 20 }}
          mx={{ base: 2, md: 14 }}
          my={{ base: 3, md: 16 }}
          alignItems="flex-start"
        >
          <Milestone {...milestoneProps} />
          <VStack
            w="full"
            alignItems="flex-start"
            borderWidth={1}
            borderRadius="sm"
            divider={<Divider sx={{ my: '0px !important' }} mt={0} mb={0} py={0} />}
          >
            {issues.edges.map(({ node }: Edge) => {
              return (
                <Box
                  p={4}
                  key={node.id}
                  w="full"
                  transition="background-color 0.1s"
                  _hover={{ bgColor: useColorModeValue('gray.50', 'gray.700') }}
                >
                  <VStack alignItems="flex-start">
                    <HStack w="full" spacing={2} justifyContent="space-between" alignItems="center">
                      <HStack alignItems="start">
                        <IssueStatus closed={node.closed} />
                        <Heading size="md">{node.title}</Heading>
                      </HStack>
                      <IssueLabels {...node.labels} />
                    </HStack>

                    <Text maxW="70ch">{node.body}</Text>
                    <UpdatedAt {...{ url: node.url, updatedAt: node.updatedAt }} />
                  </VStack>
                </Box>
              )
            })}
          </VStack>
        </VStack>
      )}
    </>
  )
}

export default IssueList
