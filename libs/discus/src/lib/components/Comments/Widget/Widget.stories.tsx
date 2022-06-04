import { Story, Meta } from '@storybook/react'
import { Widget, WidgetProps } from './Widget'

export default {
  component: Widget,
  title: 'Widget',
} as Meta

const Template: Story<WidgetProps> = (args) => <Widget {...args} />

export const Primary = Template.bind({})
Primary.args = {}
