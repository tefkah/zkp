import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Textarea,
  HStack,
  Button,
  Text,
  Avatar,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { MarkGithubIcon } from '@primer/octicons-react'
import { IUser } from '@zkp/types'
import dynamic from 'next/dynamic'
import React from 'react'
import { MarkdownToReactProps } from './md'
export interface CommentBoxContentsProps {
  isReply: boolean
  event?: Event
  handleSubmit: () => Promise<void>
  setInput: (input: string) => void
  input: string
  token: string
  reset: () => void
  isSubmitting: boolean
  signIn: () => void
  viewer?: IUser
  handleReplyOpen: () => void
}

const MarkdownToReact = dynamic<MarkdownToReactProps>(() =>
  import('./md').then((module) => module.MarkdownToReact),
)

export const CommentBoxContents = ({
  isReply,
  event,
  handleSubmit,
  setInput,
  input,
  token,
  reset,
  isSubmitting,
  signIn,
  viewer,
  handleReplyOpen,
}: CommentBoxContentsProps) => {
  return (
    <>
      <form
        className={`color-bg-primary color-border-primary gsc-comment-box${
          isReply ? '' : ' rounded border'
        }`}
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit()
        }}
      >
        <Tabs className="rounded-sm" borderRadius="sm" variant="enclosed">
          <TabList className="border-0 pt-2" pt={2} borderWidth={0}>
            <Tab
              color="gray.500"
              fontWeight="500"
              className="selected:rounded-lg"
              _selected={{
                borderWidth: 2,
                borderRadius: 'lg',
                // borderBottomWidth: 0,
                borderColor: 'gray.200',
                backgroundColor: 'foreground',
                fontWeight: 'semibold',
                color: 'primary',
              }}
            >
              Write
            </Tab>
            <Tab
              color="gray.500"
              fontWeight="500"
              _selected={{
                borderWidth: 2,
                borderRadius: 'lg',
                borderColor: 'gray.200',
                backgroundColor: 'foreground',
                fontWeight: 'semibold',
                color: 'primary',
              }}
            >
              Preview
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <Textarea
                w="full"
                py={2}
                minH="100px"
                maxH="500px"
                _disabled={{
                  cursor: 'notAllowed',
                }}
                onChange={(event) => setInput(event.target.value)}
                value={input}
              />
              <div className="align-center my-2 flex justify-between gap-2">
                <p className="text-sm font-semibold text-slate-400">
                  Markdown and L
                  <>
                    <span
                      style={{
                        textTransform: 'uppercase',
                        fontSize: '0.75em',
                        verticalAlign: '0.25em',
                        marginLeft: '-0.36em',
                        marginRight: '-0.15em',
                        lineHeight: '1ex',
                      }}
                    >
                      a
                    </span>
                    T
                    <span
                      style={{
                        textTransform: 'uppercase',
                        verticalAlign: ' -0.25em',
                        marginLeft: '-0.1667em',
                        marginRight: ' -0.125em',
                        lineHeight: '1ex',
                      }}
                    >
                      e
                    </span>
                  </>
                  X math input supported
                </p>
                {token ? (
                  <HStack>
                    {isReply && (
                      <Button bgColor="background" onClick={reset}>
                        Cancel
                      </Button>
                    )}
                    <Button
                      variant="ghoster"
                      type="submit"
                      disabled={(token && !input.trim()) || isSubmitting}
                    >
                      {isReply ? 'Reply' : 'Comment'}
                    </Button>
                  </HStack>
                ) : (
                  <Button leftIcon={<MarkGithubIcon />} onClick={() => signIn()}>
                    Sign in with GitHub
                  </Button>
                )}
              </div>
            </TabPanel>
            <TabPanel pt={6} pb={4} mb={20} minH="105px">
              <MarkdownToReact>{input}</MarkdownToReact>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </form>
    </>
  )
}
