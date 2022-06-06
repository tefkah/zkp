import { MarkGithubIcon } from '@primer/octicons-react'
import { IUser } from '@zkp/types'
import { Button, Tabs } from '@zkp/ui'
import dynamic from 'next/dynamic'
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
        <Tabs
          className="rounded-sm"
          tabs={[
            {
              title: 'Write',
              contents: (
                <>
                  <textarea
                    className={
                      'max-h-[500px] min-h-[100px] w-full rounded-md border-2 border-slate-200 p-2 disabled:cursor-not-allowed'
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
                  <div className="align-center my-2 flex items-center justify-between gap-2">
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
                          <Button
                            //  bgColor="background"
                            onClick={reset}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          // variant="ghoster"
                          type="submit"
                          disabled={(token && !input.trim()) || isSubmitting}
                        >
                          {isReply ? 'Reply' : 'Comment'}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="flex min-w-fit gap-2 bg-slate-200 text-slate-700 hover:bg-slate-300"
                        onClick={() => signIn()}
                      >
                        {<MarkGithubIcon />} Sign in
                      </Button>
                    )}
                  </div>
                </>
              ),
            },
            {
              title: 'Preview',
              contents: [
                <div className="prose-sm">
                  <MarkdownToReact>{input}</MarkdownToReact>
                </div>,
              ],
            },
          ]}
        >
          {/* <TabList className="border-0 pt-2" pt={2} borderWidth={0}>
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
            <TabPanel px={0}> */}
          {/* </TabPanel>
            <TabPanel
              className="prose mb-20 min-h-[105px] pt-6 pb-4"
              // pt={6} pb={4} mb={20} minH="105px"
            >
            </TabPanel>
          </TabPanels> */}
        </Tabs>
      </form>
    </>
  )
}
