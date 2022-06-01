import { CommentText } from './CommentText'
import { RenderLeafProps } from 'slate-react'

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.comment) {
    return <CommentText>{children}</CommentText>
  }
  return (
    <span
      {...attributes}
      {...(leaf.highlight && { 'data-cy': 'search-highlighted' })}
      className={`transition-colors ${leaf.bold ? 'font-bold' : ''} ${
        leaf.highlight ? 'bg-yellow-200 hover:bg-yellow-400' : ''
      } ${leaf.italic ? 'italic' : ''} `}
    >
      {children}
    </span>
  )
}
