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
              <div className="prose-sm min-h-[150px]">
                <MarkdownToReact>{input}</MarkdownToReact>
              </div>,
            ],
          },
        ]}
      />
    </form>
  )
}
