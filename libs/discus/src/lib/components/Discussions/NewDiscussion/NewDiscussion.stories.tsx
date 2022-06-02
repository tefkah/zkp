import { Story, Meta } from '@storybook/react'
import { NewDiscussion, NewDiscussionProps } from './NewDiscussion'

export default {
  component: NewDiscussion,
  title: 'NewDiscussion',
} as Meta

const Template: Story<NewDiscussionProps> = (args) => <NewDiscussion {...args} />

export const Primary = Template.bind({})
Primary.args = {
  token: '',
}
