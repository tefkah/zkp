import { Story, Meta } from '@storybook/react'
import { mdastToSlate } from 'remark-slate-transformer'
import { mdSlate } from '../../transformers/md/mdToSlate'
import { TinyEditor, TinyEditorProps } from './TinyEditor'

export default {
  component: TinyEditor,
  title: 'TinyEditor',
} as Meta

const Template: Story<TinyEditorProps> = (args) => <TinyEditor {...args} />

export const Primary = Template.bind({})
Primary.args = {
  text: mdSlate(`# Hey

  Heyyyy`),
  rawText: '# Hey',
}
