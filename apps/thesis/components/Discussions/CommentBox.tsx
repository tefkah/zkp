/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-shadow */
// ported from the great https://github.com/giscus/giscus

import { MarkGithubIcon } from '@primer/octicons-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import {
  useColorModeValue,
  Text,
  Textarea,
  Button,
  Link as ChakraLink,
  Tabs,
  TabPanels,
  Tab,
  TabList,
  TabPanel,
  HStack,
  Avatar,
} from '@chakra-ui/react'
import { adaptComment, adaptReply } from '../../utils/giscus/adapter'
import { IComment, IReply, IUser } from '../../types'
import { addDiscussionComment } from '../../services/github/addDiscussionComment'
import { addDiscussionReply } from '../../services/github/addDiscussionReply'
import { markdownToReact } from './md'

interface CommentBoxProps {
  viewer?: IUser
  discussionId?: string
  // eslint-disable-next-line react/no-unused-prop-types
  context?: string
  replyToId?: string
  onSubmit: (comment: IComment | IReply) => void
  onDiscussionCreateRequest?: () => Promise<string>
}

export const CommentBox = ({
  viewer,
  discussionId,
  replyToId,
  onSubmit,
  onDiscussionCreateRequest,
}: CommentBoxProps) => {
  const [input, setInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const { data: session } = useSession()
  const token = session?.accessToken as string
  const textarea = useRef<HTMLTextAreaElement>(null)
  const isReply = !!replyToId

  const reset = useCallback(() => {
    setInput('')
    setIsSubmitting(false)
    setIsReplyOpen(false)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || (!discussionId && !onDiscussionCreateRequest)) return
    setIsSubmitting(true)

    const id = discussionId || (await onDiscussionCreateRequest!())
    const payload = { body: input, discussionId: id, replyToId }

    if (replyToId) {
      addDiscussionReply(payload, token).then(({ data: { addDiscussionReply } }) => {
        const { reply } = addDiscussionReply
        const adapted = adaptReply(reply)

        onSubmit(adapted)
        reset()
      })
    } else {
      addDiscussionComment(payload, token).then(({ data: { addDiscussionComment } }) => {
        const { comment } = addDiscussionComment
        const adapted = adaptComment(comment)

        onSubmit(adapted)
        reset()
      })
    }
  }, [
    isSubmitting,
    discussionId,
    input,
    replyToId,
    onDiscussionCreateRequest,
    token,
    onSubmit,
    reset,
  ])

  const handleReplyOpen = () => {
    setIsReplyOpen(true)
  }

  useEffect(() => {
    if (!textarea.current) return
    if (isReplyOpen) textarea.current.focus()
  }, [isReplyOpen])

  return !isReply || isReplyOpen ? (
    <form
      className={`color-bg-primary color-border-primary gsc-comment-box${
        isReply ? '' : ' border rounded'
      }`}
      onSubmit={(event) => {
        event.preventDefault()
        handleSubmit()
      }}
    >
      <Tabs borderRadius="sm" variant="enclosed">
        <TabList pt={2} borderWidth={0}>
          <Tab
            color="gray.500"
            fontWeight="500"
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
              _disabled={{ cursor: 'notAllowed' }}
              onChange={(event) => setInput(event.target.value)}
              value={input}
            />
            <HStack alignItems="center" justifyContent="space-between" my={2}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.500">
                Markdown and L
                <>
                  <Text
                    as="span"
                    textTransform="uppercase"
                    fontSize="0.75em"
                    verticalAlign="0.25em"
                    marginLeft="-0.36em"
                    marginRight="-0.15em"
                    lineHeight="1ex"
                  >
                    a
                  </Text>
                  T
                  <Text
                    as="span"
                    textTransform="uppercase"
                    verticalAlign=" -0.25em"
                    marginLeft="-0.1667em"
                    marginRight=" -0.125em"
                    lineHeight="1ex"
                  >
                    e
                  </Text>
                </>
                X math input supported
              </Text>
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
            </HStack>
          </TabPanel>
          <TabPanel pt={6} pb={4} mb={20} minH="105px">
            {markdownToReact(input)}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </form>
  ) : (
    <HStack
      px={4}
      py={2}
      borderTopWidth="1"
      borderRadius="md"
      className="color-bg-tertiary gsc-reply-box"
    >
      {viewer ? (
        <ChakraLink
          isExternal
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          href={viewer.url}
          className="flex items-center flex-shrink-0"
        >
          <Avatar
            src={viewer.avatarUrl}
            width="30"
            height="30"
            // alt={`@${viewer.login}`}
          />
        </ChakraLink>
      ) : null}
      <Button
        _hover={{ _pointer: 'text' }}
        width="full"
        bgColor="white"
        color="gray.500"
        onClick={handleReplyOpen}
        type="button"
        borderColor="back"
        borderWidth={1}
      >
        Write a reply
      </Button>
    </HStack>
  )
}
