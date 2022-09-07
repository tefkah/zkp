import { Story, Meta } from '@storybook/react'
import { SingleGiscusComment, SingleGiscusCommentProps } from './SingleGiscusComment'

export default {
  component: SingleGiscusComment,
  title: 'SingleGiscusComment',
} as Meta

const Template: Story<SingleGiscusCommentProps> = (args) => <SingleGiscusComment {...args} />

export const Primary = Template.bind({})
Primary.args = {}
