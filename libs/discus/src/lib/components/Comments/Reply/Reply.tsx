// ported from the great https://github.com/giscus/giscus

import { useCallback } from 'react'
import Image from 'next/image'
import { useColorModeValue, Link as ChakraLink } from '@chakra-ui/react'
import { ReactButtons } from '../ReactButtons'
import { updateCommentReaction as defaultUpdateCommentReaction } from '../../../utils/giscus/reactions'
import { Reaction, IReply } from '@zkp/types'

import { handleCommentClick } from '../../../utils/giscus/adapter'

import {
  isoToDate as formatDate,
  isoToDateDistance as formatDateDistance,
} from '../../../utils/parseTime'
import { CommentBody } from '../CommentBody'
import Link from 'next/link'

export interface ReplyProps {
  reply: IReply
  onReplyUpdate: (newReply: IReply, promise: Promise<unknown>) => void
  updateCommentReaction?: typeof defaultUpdateCommentReaction
}

export const Reply = ({
  reply,
  onReplyUpdate,
  updateCommentReaction = defaultUpdateCommentReaction,
}: ReplyProps) => {
  const updateReactions = useCallback(
    (content: Reaction, promise: Promise<unknown>) =>
      onReplyUpdate(updateCommentReaction(reply, content), promise),
    [reply, onReplyUpdate],
  )

  const bg = useColorModeValue('gray.200', 'gray.700')
  const hidden = reply.deletedAt || reply.isMinimized

  return (
    <div className="gsc-reply relative bg-gray-50">
      <div
        // backgroundColor={bg}
        // w="2px"
        // flexShrink={0}
        // pos="absolute"
        // left="30px"
        // h="full"
        // top="0"
        className="gsc-tl-line absolute left-6 top-2 h-[90%] w-[2px] flex-shrink bg-gray-200"
      />
      <div className="items-top flex py-2 pl-2">
        <div className="gsc-reply-author-avatar relative z-10 shrink-0">
          <Link href={reply.author.url} passHref>
            <a
              // isExternal
              // display="flex"
              // alignItems="center"
              className="flex items-center"
            >
              <Image
                src={reply.author.avatarUrl}
                width="30"
                height="30"
                className="rounded-full"
                alt={`Picture of ${reply.author.login}`}
                // alt={`@${reply.author.login}`}
              />
            </a>
          </Link>
        </div>
        <div className="mx-4 w-full min-w-0">
          {!hidden ? (
            <div className="gsc-reply-header flex items-center">
              <div className="gsc-reply-author flex w-96 items-center justify-between">
                <div className="flex items-center space-x-2">
                  <a
                    // isExternal
                    href={reply.author.url}
                    className="flex items-center"
                  >
                    <span className="link-primary font-semibold">{reply.author.login}</span>
                  </a>
                  <a
                    className="ml-2 whitespace-nowrap text-slate-500"
                    // isExternal
                    href={reply.url}
                  >
                    <time title={formatDate(reply.createdAt)} dateTime={reply.createdAt}>
                      {formatDateDistance(reply.createdAt)}
                    </time>
                  </a>
                </div>
                {reply.authorAssociation !== 'NONE' ? (
                  <div className="ml-2 hidden text-xs sm:inline-flex">
                    <span
                      // fontWeight="semibold"
                      // size="sm"
                      // ml={1}
                      // px={1}
                      // borderWidth={1}
                      // borderRadius="md"
                      className={`ml-1 rounded-md border px-1 capitalize ${
                        reply.viewerDidAuthor ? 'color-box-border-info' : 'color-label-border'
                      }`}
                    >
                      {reply.authorAssociation}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="flex w-full flex-row-reverse pr-4">
                {reply.lastEditedAt ? (
                  <button
                    className="color-text-secondary gsc-reply-edited"
                    title={`Last edited at${formatDate(reply.lastEditedAt)}`}
                  >
                    Edited
                  </button>
                ) : null}
                <ReactButtons
                  reactionGroups={reply.reactions}
                  subjectId={reply.id}
                  variant="popoverOnly"
                  onReact={updateReactions}
                />
              </div>
            </div>
          ) : null}
          {/* <div
            className={`markdown gsc-reply-content w-full py-2 pr-4 ${!hidden ? ' not-shown' : ''}`}
            onClick={handleCommentClick}
            // dangerouslySetInnerHTML={
            //   hidden ? undefined : { __html: processCommentBody(reply.bodyHTML) }
            // }
          >
            {
              // eslint-disable-next-line no-nested-ternary
              !reply.body ? null : !hidden ? (
                MarkdownToReact(reply.body)
              ) : (
                <em className="color-text-secondary">
                  {reply.deletedAt ? 'thisCommentWasDeleted' : 'thisCommentWasHidden'}
                </em>
              )
            }
          </div> */}
          <CommentBody
            reply
            hidden={!!hidden}
            comment={reply}
            handleCommentClick={handleCommentClick}
          />
          {!hidden ? (
            <div className="gsc-reply-reactions">
              <ReactButtons
                reactionGroups={reply.reactions}
                subjectId={reply.id}
                variant="groupsOnly"
                onReact={updateReactions}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
