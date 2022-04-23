// ported from the great https://github.com/giscus/giscus

import { useCallback } from 'react'
import {
  useColorModeValue,
  Text,
  Link as ChakraLink,
  Box,
  Flex,
  Button,
  Avatar,
  Tag,
  HStack,
} from '@chakra-ui/react'
import { ReactButtons } from './ReactButtons'
import { IReply } from '../../types/adapter'
import { updateCommentReaction } from '../../utils/giscus/reactions'
import { Reaction } from '../../types/github'

import { handleCommentClick } from '../../utils/giscus/adapter'
import { markdownToReact } from './md'
import {
  isoToDate as formatDate,
  isoToDateDistance as formatDateDistance,
} from '../../utils/parseTime'

interface IReplyProps {
  reply: IReply
  onReplyUpdate: (newReply: IReply, promise: Promise<unknown>) => void
}

export const Reply = ({ reply, onReplyUpdate }: IReplyProps) => {
  const updateReactions = useCallback(
    (content: Reaction, promise: Promise<unknown>) =>
      onReplyUpdate(updateCommentReaction(reply, content), promise),
    [reply, onReplyUpdate],
  )
  const bg = useColorModeValue('gray.200', 'gray.700')
  const hidden = reply.deletedAt || reply.isMinimized

  return (
    <Box className="gsc-reply" pos="relative" bgColor="gray.50">
      <Box
        backgroundColor={bg}
        w="2px"
        flexShrink={0}
        pos="absolute"
        left="30px"
        h="full"
        top="0"
        className="gsc-tl-line"
      />
      <Flex py={2} pl={4} alignItems="top">
        <Box pos="relative" zIndex="10" flexShrink={0} className="gsc-reply-author-avatar">
          <ChakraLink isExternal href={reply.author.url} display="flex" alignItems="center">
            <Avatar
              src={reply.author.avatarUrl}
              width="30"
              height="30"
              // alt={`@${reply.author.login}`}
            />
          </ChakraLink>
        </Box>
        <Box w="full" minW={0} ml={4}>
          {!hidden ? (
            <Flex className="gsc-reply-header">
              <Flex
                justifyContent="space-between"
                w={96}
                alignItems="center"
                className="gsc-reply-author"
              >
                <HStack>
                  <ChakraLink
                    isExternal
                    href={reply.author.url}
                    display="flex"
                    alignItems="center"
                    className="flex items-center"
                  >
                    <Text as="span" fontWeight="semibold" className="font-semibold link-primary">
                      {reply.author.login}
                    </Text>
                  </ChakraLink>
                  <ChakraLink ml={2} isExternal href={reply.url} whiteSpace="nowrap">
                    <time title={formatDate(reply.createdAt)} dateTime={reply.createdAt}>
                      {formatDateDistance(reply.createdAt)}
                    </time>
                  </ChakraLink>
                </HStack>
                {reply.authorAssociation !== 'NONE' ? (
                  <Flex ml={2} fontSize="sm" className="hidden ml-2 text-xs sm:inline-flex">
                    <Tag
                      fontWeight="semibold"
                      size="sm"
                      ml={1}
                      px={1}
                      borderWidth={1}
                      borderRadius="md"
                      className={`px-1 ml-1 capitalize border rounded-md ${
                        reply.viewerDidAuthor ? 'color-box-border-info' : 'color-label-border'
                      }`}
                    >
                      {reply.authorAssociation}
                    </Tag>
                  </Flex>
                ) : null}
              </Flex>
              <HStack w="full" flexDir="row-reverse" pr={4} className="flex pr-4">
                {reply.lastEditedAt ? (
                  <Button
                    className="color-text-secondary gsc-reply-edited"
                    title={`Last edited at${formatDate(reply.lastEditedAt)}`}
                  >
                    Edited
                  </Button>
                ) : null}
                <ReactButtons
                  reactionGroups={reply.reactions}
                  subjectId={reply.id}
                  variant="popoverOnly"
                  onReact={updateReactions}
                />
              </HStack>
            </Flex>
          ) : null}
          <Box
            w="full"
            pr={4}
            py={2}
            className={`markdown gsc-reply-content ${!hidden ? ' not-shown' : ''}`}
            onClick={handleCommentClick}
            // dangerouslySetInnerHTML={
            //   hidden ? undefined : { __html: processCommentBody(reply.bodyHTML) }
            // }
          >
            {!reply.body ? (
              <></>
            ) : !hidden ? (
              markdownToReact(reply.body)
            ) : (
              <em className="color-text-secondary">
                {reply.deletedAt ? 'thisCommentWasDeleted' : 'thisCommentWasHidden'}
              </em>
            )}
          </Box>
          {!hidden ? (
            <Box className="gsc-reply-reactions">
              <ReactButtons
                reactionGroups={reply.reactions}
                subjectId={reply.id}
                variant="groupsOnly"
                onReact={updateReactions}
              />
            </Box>
          ) : null}
        </Box>
      </Flex>
    </Box>
  )
}
