import { Button } from '@chakra-ui/react'
import { useState } from 'react'
import { CommentThread, CommentThreadProps } from './CommentThread'

const ConditionalCommentThread = ({ title }: CommentThreadProps) => {
  const [show, setShow] = useState(false)

  if (!show) {
    return <Button onClick={() => setShow(true)}>Show Comments</Button>
  }

  return <CommentThread title={title} />
}

const CommentThreadMaybe = (props: { show: boolean; title: string }) => {
  const { show, title } = props
  if (show) {
    return <ConditionalCommentThread title={title} />
  }
  return <CommentThread title={title} />
}

export default CommentThreadMaybe
