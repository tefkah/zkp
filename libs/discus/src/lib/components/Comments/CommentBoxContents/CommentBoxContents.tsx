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
import { MarkdownToReactProps } from '../Md/MarkdownToReact'
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
  import('../Md/MarkdownToReact').then((module) => module.MarkdownToReact),
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
        className={`color-bg-primary border-0 gsc-comment-box${isReply ? '' : ' rounded border'}`}
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
              //className="selected:rounded-lg"

              className="p-2 font-semibold text-slate-500 focus:rounded-lg focus:border-2 focus:border-slate-200 focus:font-bold focus:text-red-500"
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
              className="p-2 font-semibold text-slate-500 focus:rounded-lg focus:border-2 focus:border-slate-200 focus:font-bold focus:text-red-500"
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
              <textarea
                className={
                  'max-h-[500px] min-h-[100px] w-full rounded-md border-2 border-slate-500 py-2 disabled:cursor-not-allowed'
                }
                // w="full"
                // py={2}
                // minH="100px"
                // maxH="500px"
                // _disabled={{
                //   cursor: 'notAllowed',
                // }}
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
                  <div className="flex gap-2">
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
                  </div>
                ) : (
                  <Button leftIcon={<MarkGithubIcon />} onClick={() => signIn()}>
                    Sign in with GitHub
                  </Button>
                )}
              </div>
            </TabPanel>
            <TabPanel
              className="prose mb-20 min-h-[105px] pt-6 pb-4"
              // pt={6} pb={4} mb={20} minH="105px"
            >
              <MarkdownToReact>{input}</MarkdownToReact>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </form>
    </>
  )
}
