// ported from the great https://github.com/giscus/giscus

import { Reaction , IComment, IGiscussion, IReactionGroups, IReply } from '@zkp/types'

const updateReactionGroups = (reactionGroups: IReactionGroups, reaction: Reaction) => {
  const diff = reactionGroups[reaction].viewerHasReacted ? -1 : 1
  return [
    {
      ...reactionGroups,
      [reaction]: {
        count: reactionGroups[reaction].count + diff,
        viewerHasReacted: !reactionGroups[reaction].viewerHasReacted,
      },
    },
    diff,
  ] as [IReactionGroups, number]
}

export const updateDiscussionReaction = (page: IGiscussion, reaction: Reaction) => {
  const [newReactions, diff] = updateReactionGroups(page.discussion.reactions, reaction)
  return {
    ...page,
    discussion: {
      ...page.discussion,
      reactionCount: page.discussion.reactionCount + diff,
      reactions: newReactions,
    },
  } as IGiscussion
}

export const updateCommentReaction = <T extends IComment | IReply = IComment>(
  comment: T,
  reaction: Reaction,
) => {
  const [newReactions] = updateReactionGroups(comment.reactions, reaction)
  return {
    ...comment,
    reactions: newReactions,
  } as T
}
