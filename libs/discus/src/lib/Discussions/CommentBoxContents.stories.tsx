import { Story, Meta } from '@storybook/react'
import NextAuth from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { CommentBoxContents, CommentBoxContentsProps } from './CommentBoxContents'
import { useState } from 'react'

export default {
  component: CommentBoxContents,
  title: 'CommentBoxContents',
} as Meta

const Template: Story<CommentBoxContentsProps> = (args) => {
  const [input, setInput] = useState(args.input)
  return (
    <SessionProvider>
      <CommentBoxContents {...{ ...args, input, setInput, reset: () => setInput('') }} />
    </SessionProvider>
  )
}

const defaultCommentBoxContents: CommentBoxContentsProps = {
  isReply: false,
  handleSubmit: async () => {},
  token: 'ahtaoihtnaioshnt',
  reset: () => {},
  input: 'Some text',
  setInput: () => {},
  isSubmitting: false,
  // isSubmitting: boolean
  signIn: () => {},
  handleReplyOpen: () => {},
}

export const Primary = Template.bind({})
Primary.args = defaultCommentBoxContents
