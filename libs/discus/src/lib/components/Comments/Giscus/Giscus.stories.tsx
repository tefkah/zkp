import { Story, Meta } from '@storybook/react'
import { SessionProvider } from 'next-auth/react'
import { Giscus, GiscusProps } from './Giscus'

export default {
  component: Giscus,
  title: 'Giscus',
} as Meta

const Template: Story<GiscusProps> = (args) => (
  <SessionProvider>
    <Giscus {...args} />
  </SessionProvider>
)

export const Primary = Template.bind({})
Primary.args = {}
