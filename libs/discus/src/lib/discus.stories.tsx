import { Story, Meta } from '@storybook/react'
import { Discus, DiscusProps } from './discus'

export default {
  component: Discus,
  title: 'Discus',
} as Meta

const Template: Story<DiscusProps> = (args) => <Discus {...args} />

export const Primary = Template.bind({})
Primary.args = {
  text: 'Click me!',
  padding: 0,
  style: 'default',
}
