import { Story, Meta } from '@storybook/react'
import { Comment, CommentProps } from './Comment'

export default {
  component: Comment,
  title: 'Comment',
} as Meta

const Template: Story<CommentProps> = (args) => <Comment {...args} />

export const Primary = Template.bind({})
Primary.args = {}
