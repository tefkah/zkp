import { IComment, IReply } from '@zkp/types'
import dynamic from 'next/dynamic'
import { MouseEvent as ReactMouseEvent } from 'react'
import { MarkdownToReactProps } from '../Md/MarkdownToReact'
// import { markdownToReact } from './md'

export interface CommentBodyProps {
  handleCommentClick: (event: ReactMouseEvent<HTMLElement, MouseEvent>) => void
  hidden: boolean
  comment: IComment | IReply
  reply?: boolean
}

const MarkdownToReact = dynamic<MarkdownToReactProps>(() =>
  import('../Md/MarkdownToReact').then((module) => module.MarkdownToReact),
)

export const CommentBody = ({ handleCommentClick, hidden, comment, reply }: CommentBodyProps) => {
  return (
    <div
      className={`${reply ? 'prose-sm' : 'prose'} markdown py-4 gsc-comment-content${
        comment.isMinimized ? ' minimized color-bg-tertiary border-color-primary' : ''
      }`}
      onClick={handleCommentClick}
    >
      {
        // eslint-disable-next-line no-nested-ternary
        !comment.body ? null : !hidden ? (
          <MarkdownToReact>{comment.body}</MarkdownToReact>
        ) : (
          <em className="color-text-secondary">
            {comment.deletedAt ? 'This comment was deleted' : 'This comment is minimized'}
          </em>
        )
      }
    </div>
  )
}
