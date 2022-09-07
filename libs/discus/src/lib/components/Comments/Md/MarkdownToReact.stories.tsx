import { Story, Meta } from '@storybook/react'
import { MarkdownToReact, MarkdownToReactProps } from './MarkdownToReact'

export default {
  component: MarkdownToReact,
  title: 'Md',
} as Meta

const Template: Story<MarkdownToReactProps> = (args) => <MarkdownToReact {...args} />

export const Primary = Template.bind({})
Primary.args = {
  children: `# Wow it's markdown no way

  > Yeah it's really react!`,
}
