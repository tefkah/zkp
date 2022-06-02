// ported from the great https://github.com/giscus/giscus

import {
  Text,
  Box,
  Heading,
  HStack,
  Icon,
  LinkBox,
  LinkOverlay,
  Tooltip,
  VStack,
  Container,
  useColorModeValue,
} from '@chakra-ui/react'
import { CommentDiscussionIcon } from '@primer/octicons-react'
import { formatDistance, parseISO } from 'date-fns'
import Link from 'next/link'
import React from 'react'
import { VscCircleFilled } from 'react-icons/vsc'
import { CommentEdge, DiscussionNode } from '../queries/getDiscussion'

interface Props {
  node: DiscussionNode
  lastVisit: string
  commentCount: number
  replyCount: number
  totalCount: number
}

export const DiscussionCard = ({ node, lastVisit, commentCount, replyCount }: Props) => {
  const {
    title,
    updatedAt,
    body,
    comments,
    category: { emojiHTML, description, name },
  } = node

  const isUpdated = !((parseISO(lastVisit || '') || 0) > parseISO(updatedAt))

  const totalReplyCount = comments.edges.reduce(
    (total: number, edge: CommentEdge) => total + (edge?.node?.replies?.totalCount ?? 0),
    0,
  )
  const totalCommentsandReplies = comments.totalCount + totalReplyCount

  const newComments = comments.totalCount - (commentCount || 0)
  const newReplies = totalReplyCount - (replyCount || 0)

  const light = useColorModeValue('gray.100', 'gray.700')
  const lighter = 'back'
  const text = useColorModeValue('gray.500', 'gray.200')

  return (
    <Box key={title} w="full">
      <LinkBox
        w="full"
        p={4}
        as={VStack}
        alignItems="flex-start"
        // borderWidth={1}
        borderRadius="md"
        transition="color 0.2s"
        _hover={{
          color: 'primary',
          backgroundColor: lighter,
        }}
      >
        <HStack w="full" alignItems="center" justifyContent="space-between">
          <HStack alignItems="baseline">
            <Heading maxW="60ch" size="md" fontWeight="600">
              <Link passHref href={`/discussions/${title}`}>
                <LinkOverlay>{title}</LinkOverlay>
              </Link>
            </Heading>
            {isUpdated && (
              <Box>
                <Icon mb={1} as={VscCircleFilled} color="primary" />
              </Box>
            )}
          </HStack>
          <Box>
            <Tooltip label={description}>
              <HStack borderWidth={1} py="2px" borderRadius="2xl" bg={light} px={3}>
                <Box fontSize="sm" dangerouslySetInnerHTML={{ __html: emojiHTML }} />
                <Text fontSize="sm" color={text} fontWeight="semibold">
                  {name}
                </Text>
              </HStack>
            </Tooltip>
          </Box>
        </HStack>
        <HStack alignItems="baseline" w="full" justifyContent="space-between">
          <Box>
            <Container py={2} px={0}>
              {body}
            </Container>
          </Box>
          <HStack alignItems="center">
            <Text>{totalCommentsandReplies}</Text>
            <Box>
              <Icon as={CommentDiscussionIcon} />
            </Box>
          </HStack>
        </HStack>
        <HStack alignItems="bottom" spacing={4} w="full" justifyContent="space-between">
          <Text fontSize="sm" color="gray.500">
            Updated {formatDistance(parseISO(updatedAt), new Date(), { addSuffix: true })}
          </Text>
          <VStack color="gray.400" fontWeight="semibold" alignItems="flex-end" spacing={0}>
            {newComments && (
              <Text fontSize="xs">{`${newComments} new ${
                newComments > 1 ? 'comments' : 'comment'
              }`}</Text>
            )}
            {newReplies && (
              <Text fontSize="xs">{`${newReplies} new ${
                newReplies > 1 ? 'replies' : 'reply'
              }`}</Text>
            )}
          </VStack>
        </HStack>
      </LinkBox>
    </Box>
  )
}
