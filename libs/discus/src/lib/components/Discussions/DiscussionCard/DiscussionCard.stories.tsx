import { Story, Meta } from '@storybook/react'
import { DiscussionCard, DiscussionCardProps } from './DiscussionCard'

export default {
  component: DiscussionCard,
  title: 'DiscussionCard',
} as Meta

const Template: Story<DiscussionCardProps> = (args) => <DiscussionCard {...args} />

export const Primary = Template.bind({})

const node: DiscussionCardProps['node'] = {
  author: {
    login: 'ThomasFKJorna',
    url: 'https://github.com/ThomasFKJorna',
    avatarUrl: 'https://avatars.githubusercontent.com/u/21983833?s=40&v=4',
  },
  title: 'Discussion 1',
  updatedAt: '',
  body: 'Wow, this sure is some Markdown \n ###hey',
  comments: { totalCount: 22, edges: [] },
  category: { emojiHTML: '🧐', description: 'Thinky', name: 'Thinky' },
}

Primary.args = {
  node,
  commentCount: 1,
  lastVisit: '2021-12-03T10:15:30Z',
  replyCount: 12,
  totalCount: 15,
} as DiscussionCardProps
