import { Story, Meta } from '@storybook/react'
import { EditMenu, EditMenuProps } from './EditMenu'

export default {
  component: EditMenu,
  title: 'EditMenu',
} as Meta

const Template: Story<EditMenuProps> = (args) => <EditMenu {...args} />

export const Primary = Template.bind({})
Primary.args = {}
