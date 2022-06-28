// ported from the great https://github.com/giscus/giscus

import { Tooltip } from '@chakra-ui/react'
import { CommentDiscussionIcon } from '@primer/octicons-react'
import { CommentEdge, DiscussionNode } from '@zkp/types'
import { Container } from '@zkp/ui'
import { formatDistance, parseISO } from 'date-fns'
import Link from 'next/link'
import { VscCircleFilled } from 'react-icons/vsc'

export interface DiscussionCardProps {
  node: DiscussionNode
  lastVisit: string
  commentCount: number
  replyCount: number
  totalCount: number
}

export const DiscussionCard = ({
  node,
  lastVisit,
  commentCount,
  replyCount,
}: DiscussionCardProps) => {
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

  // const light = useColorModeValue('gray.100', 'gray.700')
  // const lighter = 'back'
  // const text = useColorModeValue('gray.500', 'gray.200')

  return (
    <div className="w-full" key={title}>
      <div className="item-start flex w-full flex-col gap-2 rounded-md p-4 transition-colors hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-700">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <h2 className="text-md truncate font-semibold">
              <Link passHref href={`/discussions/${title}`}>
                <a>{title}</a>
              </Link>
            </h2>
            {isUpdated && (
              <div>
                <VscCircleFilled />
              </div>
            )}
          </div>
          <div>
            <Tooltip label={description}>
              <div className="border-1 flex gap-2 rounded-2xl bg-slate-100 px-2 py-1 dark:bg-slate-900">
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: emojiHTML }} />
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-200">{name}</p>
              </div>
            </Tooltip>
          </div>
        </div>
        <div className="flex w-full items-baseline justify-between gap-2">
          <div className="px-y flex justify-start px-0">
            <p>{body}</p>
          </div>
          <div className="flex items-center gap-2">
            <p>{totalCommentsandReplies}</p>
            <div>
              <CommentDiscussionIcon />
            </div>
          </div>
        </div>
        <div className="items-bottom flex w-full justify-between gap-4">
          <p className="color-slate-500 text-sm">
            Updated {formatDistance(parseISO(updatedAt), new Date(), { addSuffix: true })}
          </p>
          <div className="flex flex-col items-end font-semibold text-slate-400">
            {newComments > 0 && (
              <p className="text-xs">{`${newComments} new ${
                newComments > 1 ? 'comments' : 'comment'
              }`}</p>
            )}
            {newReplies > 0 && (
              <p className="text-xs">{`${newReplies} new ${
                newReplies > 1 ? 'replies' : 'reply'
              }`}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
