import { Story, Meta } from '@storybook/react'
import { SessionProvider } from 'next-auth/react'
import { ReactButtons, ReactButtonsProps } from '.'

export default {
  component: ReactButtons,
  title: 'ReactButtons',
} as Meta

const Template: Story<ReactButtonsProps> = (args) => (
  <SessionProvider>
    <ReactButtons {...args} />
  </SessionProvider>
)

const defaultReactButtons: ReactButtonsProps = {
  reactionGroups: {
    CONFUSED: { count: 1, viewerHasReacted: false },
    EYES: { count: 1, viewerHasReacted: false },
    HEART: { count: 1, viewerHasReacted: false },
    HOORAY: { count: 1, viewerHasReacted: false },

    LAUGH: { count: 1, viewerHasReacted: false },

    ROCKET: { count: 1, viewerHasReacted: false },

    THUMBS_DOWN: { count: 1, viewerHasReacted: false },

    THUMBS_UP: { count: 1, viewerHasReacted: false },
  },

  subjectId: 'astky',
  variant: 'groupsOnly',
  onReact: (content: any, promise: any) => {},
  // viewerDidAuthor: false,
  // createdAt: '2007-12-03T10:15:30Z',
  // url: 'https://github.com/ThomasFKJorna',
  // authorAssociation: 'OWNER',
  // lastEditedAt: null,
  // deletedAt: null,
  // isMinimized: false,
  // body: '# Hey Nerd!',

  // replyToId: 'ashtaisht',
}

export const GroupsOnly = Template.bind({})
GroupsOnly.args = defaultReactButtons

export const PopoverOnly = Template.bind({})
PopoverOnly.args = { ...defaultReactButtons, variant: 'popoverOnly' }

export const All = Template.bind({})
All.args = { ...defaultReactButtons, variant: 'all' }
// onReactButtonsUpdate: async () => {},
// updateCommentReaction: (reply: any, reaction: any) => reply,
