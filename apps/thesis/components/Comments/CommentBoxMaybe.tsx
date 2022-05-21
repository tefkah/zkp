import { Button } from '@chakra-ui/react'
import { useState } from 'react'
import { CommentBox } from './CommentBox'

const ConditionalCommentBox = ({ title }: { title: string }) => {
  const [show, setShow] = useState(false)

  if (!show) {
    return <Button onClick={() => setShow(true)}>Show Comments</Button>
  }

  return <CommentBox title={title} />
}

const CommentBoxMaybe = (props: { show: boolean; title: string }) => {
  const { show, title } = props
  if (show) {
    return <ConditionalCommentBox title={title} />
  }
  return <CommentBox title={title} />
}

export default CommentBoxMaybe
