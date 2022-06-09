import { CommentBody } from '../CommentBody'
// ported from the great https://github.com/giscus/giscus

import { ArrowUpIcon, KebabHorizontalIcon } from '@primer/octicons-react'
import { ReactElement, ReactNode, useCallback, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button, Icon } from '@chakra-ui/react'
import { handleCommentClick } from '../../../utils/giscus/adapter'
import { Reaction, IComment, IReply } from '@zkp/types'
import { updateCommentReaction } from '../../../utils/giscus/reactions'
import { toggleUpvote } from '../../../services/github/toggleUpvote'
import { CommentBox } from '../CommentBox'
import { ReactButtons } from '../ReactButtons'
import { Reply } from '../Reply'
import {
  isoToDate as formatDate,
  isoToDateDistance as formatDateDistance,
} from '../../../utils/parseTime'
import Link from 'next/link'
import Image from 'next/image'
import { getViewportPointFromEvent } from 'framer-motion/types/events/event-info'
import { deleteComment } from '../../../services/github/deleteComment'
import { EditMenu } from '../EditMenu'
// import Image from 'next/image'

interface ICommentProps {
  children?: ReactNode
  comment: IComment
  replyBox?: ReactElement<typeof CommentBox>
  onCommentUpdate: (newComment: IComment, promise: Promise<unknown>) => void
  onCommentDelete: (comment: IComment, promise: Promise<unknown>) => void
  onReplyUpdate?: (newReply: IReply, promise: Promise<unknown>) => void
  onReplyDelete?: (reply: IReply, promise: Promise<unknown>) => void
}

export const Comment = ({
  children,
  comment,
  replyBox,
  onCommentUpdate,
  onCommentDelete,
  onReplyUpdate,
  onReplyDelete,
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

  const canEdit = comment.viewerCanUpdate
  const canDelete = comment.viewerCanDelete
  const canMinimize = !comment.isMinimized && comment.viewerCanMinimize

  const isEditing = false
  console.log(canDelete, canEdit, canMinimize)
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
            <div
              // w="full"
              // justifyContent="space-between"
              // pt={2}
              // alignItems="center"
              className="gsc-comment-author flex w-full items-center justify-between gap-2 pt-2"
            >
              <div className="flex items-center">
                <Link passHref href={comment.author.url}>
                  <a
                    // as={ChakraLink}
                    // spacing={2}
                    // alignItems="center"
                    // isExternal
                    className="gsc-comment-author-avatar flex items-center gap-2 rounded-full"
                  >
                    <Image
                      src={comment.author.avatarUrl}
                      width="30"
                      className="rounded-full"
                      height="30"
                      alt={`@${comment.author.login}`}
                    />
                    <span className="link-primary font-semibold">{comment.author.login}</span>
                  </a>
                </Link>
                <Link href={comment.url} passHref>
                  {/* <Link isExternal ml={2} href={comment.url} className="link-secondary ml-2"> */}
                  <a className="link-secondary ml-2">
                    <time
                      // whiteSpace="nowrap"
                      className="whitespace-nowrap"
                      title={formatDate(comment.createdAt)}
                      dateTime={comment.createdAt}
                    >
                      {formatDateDistance(comment.createdAt)}
                    </time>
                  </a>
                </Link>
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
              <EditMenu
                handleDelete={() =>
                  onCommentDelete(comment, deleteComment({ commentID: comment.id }, token))
                }
                canDelete={canDelete}
                canEdit={canEdit}
                canMinimize={canMinimize}
              />
            </div>
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
        <div className="px-4">
          {isEditing ? (
            <CommentBox onSubmit={() => {}} defaultText={comment.body} />
          ) : (
            <CommentBody
              handleCommentClick={handleCommentClick}
              hidden={hidden}
              comment={comment}
            />
          )}
        </div>
        {children}
        {!comment.isMinimized && onCommentUpdate ? (
          <div
            // justifyContent="space-between"
            // alignItems="center"
            // mb="3"
            className="gsc-comment-footer mb-3 flex items-center justify-between"
          >
            <div
              // ml={4}
              // alignItems="start"
              // justifyContent="end"
              className="gsc-comment-reactions ml-4 flex items-center justify-end gap-2"
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
            <div className="gsc-comment-replies-count mr-4 whitespace-nowrap">
              <span>{comment.replyCount} replies</span>
            </div>
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
                <div
                  // justifyContent="center"
                  // alignItems="center"
                  // flex="shrink"
                  // mr="9px"
                  // w="29px"
                  className="mr-[9px] flex w-[29px] flex-shrink items-center justify-center"
                >
                  <Icon as={KebabHorizontalIcon} width="full" rotate="90" />
                </div>

                {hasNextPage ? (
                  <Button variant="link" onClick={incrementBackPage}>
                    See {remainingReplies} previous replies
                  </Button>
                ) : null}

                {hasUnfetchedReplies ? (
                  <Link passHref href={comment.url}>
                    <a className="color-text-link hover:underline">
                      See {remainingReplies} previous replies on GitHub
                    </a>
                  </Link>
                ) : null}
              </div>
            ) : null}

            {onReplyUpdate
              ? replies.map((reply) => (
                  <Reply
                    key={reply.id}
                    reply={reply}
                    onReplyUpdate={onReplyUpdate}
                    onReplyDelete={() => {
                      onReplyDelete &&
                        onReplyDelete(reply, deleteComment({ commentID: reply.id }, token))
                    }}
                  />
                ))
              : null}
          </div>
        ) : null}

        {!comment.isMinimized && !!replyBox ? replyBox : null}
      </div>
    </div>
  )
}
