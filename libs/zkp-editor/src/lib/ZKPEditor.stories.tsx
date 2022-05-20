import { Story, Meta } from '@storybook/react'
import { mdxSlate } from './mdx/mdxToSlate'
import { SearchHighlightingExample } from './ZKPEditor'

export default {
  component: SearchHighlightingExample,
  title: 'SearchHighlightingExample',
} as Meta

const Template: Story = (args) => <SearchHighlightingExample {...args} />

export const Primary = Template.bind({})

const text = mdxSlate('# Hey!')
Primary.args = { text }
