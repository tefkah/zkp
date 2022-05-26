import { Box, Divider, Heading, HStack, LinkBox, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Edge, MilestoneNode, NearestMilestoneData } from '@zkp/types'
import { IssueLabels } from './Labels'
import { Milestone } from './Milestone'
import { IssueStatus } from './Status'
import { UpdatedAt } from './UpdatedAt'

interface IssueListProps {
  milestoneContent: NearestMilestoneData
}
export const IssueList = (props: IssueListProps) => {
  // const { data, isLoading, error }: { data: NearestMilestoneData; isLoading: boolean; error: any } =
  //   useGQL(nearestMilestoneWithIssues({ first: 100 }))
  const { milestoneContent } = props

  const { issues, ...milestoneProps } =
    milestoneContent?.data?.repository?.milestones?.edges?.[0]?.node ?? ({} as MilestoneNode)
  if (!milestoneContent) return null
  return (
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
        {issues?.edges?.map(({ node }: Edge) => (
          <LinkBox as={Box} p={4} key={node.title} w="full">
            <VStack
              alignItems="flex-start"
              transition="background-color 0.1s"
              _hover={{ bgColor: 'hover' }}
            >
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
          </LinkBox>
        ))}
      </VStack>
    </VStack>
  )
}
