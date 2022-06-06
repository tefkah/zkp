import { DiscussionQuery, IDiscussionData, Reaction } from '@zkp/types'
import { useCallback } from 'react'
import { updateDiscussionReaction } from '../utils'
import { useDiscussion } from './useDiscussion'

export const useFrontBackDiscussion = (query: DiscussionQuery, token?: string) => {
  const backDiscussion = useDiscussion(query, token, { last: 15 })
  const {
    data: backkData,
    isLoading: isBackLoading,
    mutators: backMutators,
    error: backError,
  } = backDiscussion

  const backData = backkData && backkData[backkData.length - 1]
  const intersectId = backData?.discussion?.comments?.[0]?.id

  const frontDiscussion = useDiscussion(query, token, { first: 15 })
  const {
    data: fronttData,
    isLoading: isFrontLoading,
    mutators: frontMutators,
    size,
    setSize,
    error: frontError,
  } = frontDiscussion

  const frontData = fronttData?.map((page) => {
    let foundIntersect = false

    // We couldn't make use of GitHub API's `before` parameter to prevent
    // duplicates because that would change our key for SWR. Therefore,
    // we need to get rid of duplicates manually by removing the comments
    // that are already in backData.
    const newData = {
      ...page,
      discussion: {
        ...page?.discussion,
        comments: page?.discussion?.comments?.filter((comment) => {
          if (comment.id === intersectId) {
            foundIntersect = true
          }
          return !foundIntersect
        }),
      },
    }

    // Fix the reply count.
    newData.discussion.totalReplyCount = newData.discussion.comments?.reduce(
      (prev, c) => prev + c.replyCount,
      0,
    )

    return newData
  })

  const backComments = backData?.discussion?.comments || []
  const frontComments = frontData?.flatMap((page) => page?.discussion?.comments || []) || []

  const updateReactions = useCallback(
    (reaction: Reaction, promise: Promise<unknown>) =>
      backData
        ? backMutators.updateDiscussion([updateDiscussionReaction(backData, reaction)], promise)
        : promise.then(() => backMutators.mutate()),
    [backData, backMutators],
  )

  const increaseSize = useCallback(() => setSize(size + 1), [setSize, size])

  const numHidden =
    (backData?.discussion?.totalCommentCount ?? 0) -
    (backData?.discussion?.comments?.length ?? 0) -
    (frontData?.reduce((prev, g) => prev + (g.discussion.comments?.length ?? 0), 0) ?? 0)

  const reactionCount = backData?.discussion?.reactionCount
  const totalCommentCount = backData?.discussion?.totalCommentCount

  const totalReplyCount =
    (backData?.discussion?.totalReplyCount || 0) +
    (frontData?.reduce((prev, g) => prev + g.discussion.totalReplyCount, 0) || 0)

  const error = frontError || backError
  const needsFrontLoading = backData?.discussion?.pageInfo?.hasPreviousPage

  const isLoading = (needsFrontLoading && isFrontLoading) || isBackLoading
  const isLoadingMore = isFrontLoading || (size > 0 && !frontData?.[size - 1])
  const isNotFound = error?.status === 404
  const isRateLimited = error?.status === 429
  const isLocked = backData?.discussion?.locked

  const discussion: IDiscussionData = {
    body: backData?.discussion?.body || '',
    id: backData?.discussion?.id || '',
    url: backData?.discussion?.url || '',
    locked: backData?.discussion?.locked || false,
    reactions: backData?.discussion?.reactions,
    repository: backData?.discussion?.repository || {
      nameWithOwner: 'ThomasFKJorna/thesis-discussions',
    },
    reactionCount: reactionCount || 0,
    totalCommentCount: totalCommentCount || 0,
    totalReplyCount,
  }

  const viewer = backData?.viewer

  return {
    updateReactions,
    increaseSize,
    frontData,
    frontComments,
    frontMutators,
    backData,
    backComments,
    backMutators,
    numHidden,
    reactionCount,
    totalCommentCount,
    totalReplyCount,
    error,
    isLoading,
    isLoadingMore,
    isNotFound,
    isRateLimited,
    isLocked,
    discussion,
    viewer,
  }
}
