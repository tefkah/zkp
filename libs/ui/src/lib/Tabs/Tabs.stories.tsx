import { Story, Meta } from '@storybook/react'
import { Tabs } from './Tabs'

export default {
  component: Tabs,
  title: 'Tabs',
} as Meta

const Template: Story = (args) => <Tabs {...args} />

export const Primary = Template.bind({})
Primary.args = {}
