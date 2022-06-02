import { Story, Meta } from '@storybook/react'
import { CommentBody } from './CommentBody'

export default {
  component: CommentBody,
  title: 'CommentBody',
} as Meta

const Template: Story = (args) => <CommentBody {...args} />

export const Primary = Template.bind({})
Primary.args = {}
