import { Story, Meta } from '@storybook/react'
import { ICommentBox } from '@zkp/types'
import { SessionProvider } from 'next-auth/react'
import { CommentBox, CommentBoxProps } from './CommentBox'

export default {
  component: CommentBox,
  title: 'CommentBox',
} as Meta

const Template: Story<CommentBoxProps> = (args) => (
  <SessionProvider>
    <CommentBox {...args} />
  </SessionProvider>
)

const defaultCommentBox = {
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
} as ICommentBox

export const Primary = Template.bind({})
Primary.args = {
  reply: defaultCommentBox,
  onCommentBoxUpdate: async () => {},
  updateCommentReaction: (reply: any, reaction: any) => reply,
}
