import { CommentBody } from './CommentBody'
// ported from the great https://github.com/giscus/giscus

import { ArrowUpIcon, KebabHorizontalIcon } from '@primer/octicons-react'
import { ReactElement, ReactNode, useCallback, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  Text,
  Tag,
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  Avatar,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { handleCommentClick } from '../../utils/giscus/adapter'
import { Reaction, IComment, IReply } from '@zkp/types'
import { updateCommentReaction } from '../../utils/giscus/reactions'
import { toggleUpvote } from '../../services/github/toggleUpvote'
import { CommentBox } from './CommentBox'
import { ReactButtons } from './ReactButtons'
import { Reply } from './Reply'
import { MarkdownToReact } from './md'
import {
  isoToDate as formatDate,
  isoToDateDistance as formatDateDistance,
} from '../../utils/parseTime'
// import Image from 'next/image'

interface ICommentProps {
  children?: ReactNode
  comment: IComment
  replyBox?: ReactElement<typeof CommentBox>
  onCommentUpdate: (newComment: IComment, promise: Promise<unknown>) => void
  onReplyUpdate?: (newReply: IReply, promise: Promise<unknown>) => void
}

export const Comment = ({
  children,
  comment,
  replyBox,
  onCommentUpdate,
  onReplyUpdate,
}: ICommentProps) => {
  const [backPage, setBackPage] = useState(0)

  const replies = comment.replies.slice(-5 - backPage * 50)
  const remainingReplies = comment.replyCount - replies.length

  const hasNextPage = replies.length < comment.replies.length
  const hasUnfetchedReplies = !hasNextPage && remainingReplies > 0

  const { data: session } = useSession()
  const token = session?.accessToken as string

  const updateReactions = useCallback(
    (reaction: Reaction, promise: Promise<unknown>) =>
      onCommentUpdate(updateCommentReaction(comment, reaction), promise),
    [comment, onCommentUpdate],
  )

  const incrementBackPage = () => setBackPage(backPage + 1)

  const upvote = useCallback(() => {
    const upvoteCount = comment.viewerHasUpvoted ? comment.upvoteCount - 1 : comment.upvoteCount + 1

    const promise = toggleUpvote(
      { upvoteInput: { subjectId: comment.id } },
      token,
      comment.viewerHasUpvoted,
    )

    onCommentUpdate(
      {
        ...comment,
        upvoteCount,
        viewerHasUpvoted: !comment.viewerHasUpvoted,
      },
      promise,
    )
  }, [comment, onCommentUpdate, token])

  const hidden = !!comment.deletedAt || comment.isMinimized

  return (
    <div className="my-4 flex text-sm">
      <div
        // w="full"
        // minW={0}
        // borderRadius="md"
        // borderWidth={1}
        className={`color-bg-primary w-full min-w-0 rounded-md border ${
          comment.viewerDidAuthor ? 'color-box-border-info' : 'color-border-primary'
        }`}
      >
        {!comment.isMinimized ? (
          <div className="flex w-full items-center  justify-between px-4">
            <HStack
              w="full"
              justifyContent="space-between"
              pt={2}
              alignItems="center"
              className="gsc-comment-author"
            >
              <div className="flex">
                <HStack
                  as={ChakraLink}
                  spacing={2}
                  alignItems="center"
                  isExternal
                  href={comment.author.url}
                  className="gsc-comment-author-avatar"
                >
                  <Avatar
                    src={comment.author.avatarUrl}
                    width="30"
                    height="30"
                    // alt={`@${comment.author.login}`}
                  />
                  <span className="link-primary font-semibold">{comment.author.login}</span>
                </HStack>
                <ChakraLink isExternal ml={2} href={comment.url} className="link-secondary ml-2">
                  <time
                    // whiteSpace="nowrap"
                    className="whitespace-nowrap"
                    title={formatDate(comment.createdAt)}
                    dateTime={comment.createdAt}
                  >
                    {formatDateDistance(comment.createdAt)}
                  </time>
                </ChakraLink>
              </div>
              {comment.authorAssociation !== 'NONE' ? (
                <span
                  className={`ml-1 rounded-md border px-1 capitalize ${
                    comment.viewerDidAuthor ? 'color-box-border-info' : 'color-label-border'
                  }`}
                >
                  {comment.authorAssociation}
                </span>
              ) : null}
            </HStack>
            <div className="flex">
              {comment.lastEditedAt ? (
                <Button
                  color="gray.500"
                  className="color-text-secondary gsc-comment-edited"
                  title={`Last edited at${formatDate(comment.lastEditedAt)}`}
                >
                  Edit
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
        <CommentBody handleCommentClick={handleCommentClick} hidden={hidden} comment={comment} />
        {children}
        {!comment.isMinimized && onCommentUpdate ? (
          <div
            // justifyContent="space-between"
            // alignItems="center"
            // mb="3"
            className="gsc-comment-footer mb-3 items-center justify-between"
          >
            <div
              // ml={4}
              // alignItems="start"
              // justifyContent="end"
              className="gsc-comment-reactions ml-4 flex items-start justify-end"
            >
              <Button
                borderRadius="xl"
                size="sm"
                leftIcon={<ArrowUpIcon />}
                type="button"
                _hover={{ transform: { translateY: '-10%' } }}
                transition="transform 0.15s"
                // </HStack> className={`gsc-upvote-button gsc-social-reaction-summary-item ${
                //   comment.viewerHasUpvoted ? 'has-reacted' : ''
                // }`}
                onClick={upvote}
                disabled={!token || !comment.viewerCanUpvote}
                aria-label="upvote"
              >
                {comment.upvoteCount}
              </Button>
              {!hidden ? (
                <ReactButtons
                  reactionGroups={comment.reactions}
                  subjectId={comment.id}
                  onReact={updateReactions}
                />
              ) : null}
            </div>
            <Box mr={4} whiteSpace="nowrap" className="gsc-comment-replies-count">
              <span>{comment.replyCount} replies</span>
            </Box>
          </div>
        ) : null}
        {comment.replies.length > 0 ? (
          <div
            style={{
              '.gsc-reply:first-child > .gsc-tl-line': {
                top: '16px',
                height: 'calc(100% - 16px)',
              },
            }}
            // pt={2}
            // borderWidth={1}
            // bgColor="gray.50"
            // borderBottomRadius="md"
            className={`border-w-1 color-bg-canvas-inset color-border-primary gsc-replies rounded-md bg-gray-50 pt-2 ${
              !replyBox || hidden ? 'rounded-b-md' : ''
            }`}
          >
            {hasNextPage || hasUnfetchedReplies ? (
              <div
                // justifyContent="center"
                // h={8}
                // pl={4}
                // mb={2}
                // alignItems="center"
                className="mb-2 flex h-8 items-center pl-4"
              >
                <Flex justifyContent="center" alignItems="center" flex="shrink" mr="9px" w="29px">
                  <Icon as={KebabHorizontalIcon} width="full" rotate="90" />
                </Flex>

                {hasNextPage ? (
                  <Button variant="link" onClick={incrementBackPage}>
                    See {remainingReplies} previous replies
                  </Button>
                ) : null}

                {hasUnfetchedReplies ? (
                  <ChakraLink
                    href={comment.url}
                    className="color-text-link hover:underline"
                    isExternal
                  >
                    See {remainingReplies} previous replies on GitHub
                  </ChakraLink>
                ) : null}
              </div>
            ) : null}

            {onReplyUpdate
              ? replies.map((reply) => (
                  <Reply key={reply.id} reply={reply} onReplyUpdate={onReplyUpdate} />
                ))
              : null}
          </div>
        ) : null}

        {!comment.isMinimized && !!replyBox ? replyBox : null}
      </div>
    </div>
  )
}
