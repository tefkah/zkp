import { Story, Meta } from '@storybook/react'
import NextAuth from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { ReplyBoxContents, ReplyBoxContentsProps } from './ReplyBoxContents'
import '../../'

export default {
  component: ReplyBoxContents,
  title: 'ReplyBoxContents',
} as Meta

const Template: Story<ReplyBoxContentsProps> = (args) => <ReplyBoxContents {...args} />

export const Primary = Template.bind({})
Primary.args = {
  handleReplyOpen: () => {},
}
