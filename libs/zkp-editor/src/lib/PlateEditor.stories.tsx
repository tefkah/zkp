import { Story, Meta } from '@storybook/react'
import { Descendant } from 'slate'
import { mdxSlate } from './mdx/mdxToSlate'
import { PlateEditor } from './PlateEditor'

export default {
  component: PlateEditor,
  title: 'PlateEditor',
} as Meta

const Template: Story = (args) => <PlateEditor {...args} />

export const Primary = Template.bind({})

const text = mdxSlate('# Hey!')

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'This is editable text that you can search. As you search, it looks for matching strings of text, and adds ',
      },
      { text: 'decorations', strong: true },
      { text: ' to them in realtime.' },
    ],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Try it out for yourself by typing in the search box above!' }],
  },
]

// Primary.args = { text }
Primary.args = { initialValue: initialValue }
