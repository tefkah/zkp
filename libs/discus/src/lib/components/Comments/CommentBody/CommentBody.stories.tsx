import { Story, Meta } from '@storybook/react'
import { IComment } from '@zkp/types'
import { CommentBody, CommentBodyProps } from './CommentBody'

export default {
  component: CommentBody,
  title: 'CommentBody',
} as Meta

const Template: Story<CommentBodyProps> = (args) => <CommentBody {...args} />

export const Primary = Template.bind({})
Primary.args = {
  handleCommentClick: () => {},
  hidden: false,
  comment: {
    id: 'sathts',
    author: {
      avatarUrl: 'https://avatars.githubusercontent.com/u/21983833?s=40&v=4',
      login: 'ThomasFKJorna',
      url: 'https://github.com/ThomasFKJorna',
    },

    viewerDidAuthor: false,
    createdAt: '2007-12-03T10:15:30Z',
    url: 'https://github.com/ThomasFKJorna',
    authorAssociation: 'OWNER',
    lastEditedAt: null,
    deletedAt: null,
    isMinimized: false,
    body: '# Hey Nerd!',
    reactions: {
      CONFUSED: { count: 1, viewerHasReacted: false },
      EYES: { count: 1, viewerHasReacted: false },
      HEART: { count: 1, viewerHasReacted: false },
      HOORAY: { count: 1, viewerHasReacted: false },

      LAUGH: { count: 1, viewerHasReacted: false },

      ROCKET: { count: 1, viewerHasReacted: false },

      THUMBS_DOWN: { count: 1, viewerHasReacted: false },

      THUMBS_UP: { count: 1, viewerHasReacted: false },
    },

    replyToId: 'ashtaisht',
    upvoteCount: 10,
    viewerHasUpvoted: true,
    viewerCanUpvote: true,
    replyCount: 10,
    replies: [],
  } as IComment,
}
