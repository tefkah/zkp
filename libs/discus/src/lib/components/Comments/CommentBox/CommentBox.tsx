import { CommentBoxContents } from '../CommentBoxContents/CommentBoxContents'
/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-shadow */
// ported from the great https://github.com/giscus/giscus

import { useCallback, useEffect, useRef, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { adaptComment, adaptReply } from '../../../utils/giscus/adapter'
import { IComment, IReply, IUser } from '@zkp/types'
import { addDiscussionComment } from '../../../services/github/addDiscussionComment'
import { addDiscussionReply } from '../../../services/github/addDiscussionReply'
import { ReplyBoxContents } from '../ReplyBoxContents'

export interface CommentBoxProps {
  viewer?: IUser
  discussionId?: string
  // eslint-disable-next-line react/no-unused-prop-types
  context?: string
  replyToId?: string
  defaultText?: string
  onSubmit: (comment: IComment | IReply) => void
  onDiscussionCreateRequest?: () => Promise<string>
}

export const CommentBox = ({
  viewer,
  discussionId,
  replyToId,
  onSubmit,
  onDiscussionCreateRequest,
  defaultText,
}: CommentBoxProps) => {
  const [input, setInput] = useState(defaultText || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const { data: session } = useSession()
  const token = session?.accessToken as string
  const textarea = useRef<HTMLTextAreaElement>(null)
  const isReply = !!replyToId

  const reset = useCallback(() => {
    setInput('')
    setIsSubmitting(false)
    setIsReplyOpen(false)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || (!discussionId && !onDiscussionCreateRequest)) return
    setIsSubmitting(true)

    const id = discussionId || (await onDiscussionCreateRequest!())
    const payload = { body: input, discussionId: id, replyToId }

    if (replyToId) {
      addDiscussionReply(payload, token).then(({ data: { addDiscussionReply } }) => {
        const { reply } = addDiscussionReply
        const adapted = adaptReply(reply)

        onSubmit(adapted)
        reset()
      })
    } else {
      addDiscussionComment(payload, token).then(({ data: { addDiscussionComment } }) => {
        const { comment } = addDiscussionComment
        const adapted = adaptComment(comment)

        onSubmit(adapted)
        reset()
      })
    }
  }, [
    isSubmitting,
    discussionId,
    input,
    replyToId,
    onDiscussionCreateRequest,
    token,
    onSubmit,
    reset,
  ])

  const handleReplyOpen = () => {
    setIsReplyOpen(true)
  }

  useEffect(() => {
    if (!textarea.current) return
    if (isReplyOpen) textarea.current.focus()
  }, [isReplyOpen])

  return !isReply || isReplyOpen ? (
    <CommentBoxContents
      isReply={isReply}
      event={event}
      handleSubmit={handleSubmit}
      setInput={setInput}
      input={input}
      token={token}
      reset={reset}
      isSubmitting={isSubmitting}
      signIn={signIn}
      viewer={viewer}
      handleReplyOpen={handleReplyOpen}
    />
  ) : (
    <ReplyBoxContents handleReplyOpen={handleReplyOpen} viewer={viewer} />
  )
}
