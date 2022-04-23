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
import { IComment, IReply, IUser } from '../../types/adapter'
import { addDiscussionComment } from '../../services/github/addDiscussionComment'
import { addDiscussionReply } from '../../services/github/addDiscussionReply'
import { markdownToReact } from './md'

interface CommentBoxProps {
  viewer?: IUser
  discussionId?: string
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

  const light = 'back'
  const dark = 'foreground'
  const white = useColorModeValue('black', 'white')
  const med = useColorModeValue('gray.300', 'gray.600')

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
      <Tabs borderWidth={1} borderRadius="md" variant="enclosed">
        <TabList pt={2} px={4} backgroundColor={light}>
          <Tab
            color="gray.500"
            fontWeight="500"
            _selected={{
              borderWidth: 2,
              borderBottomWidth: 0,
              borderColor: 'gray.200',
              backgroundColor: dark,
              fontWeight: 'semibold',
              color: white,
            }}
          >
            Write
          </Tab>
          <Tab
            color="gray.500"
            fontWeight="500"
            _selected={{
              borderWidth: 2,
              borderBottomWidth: 0,
              borderColor: 'gray.200',
              backgroundColor: dark,
              fontWeight: 'semibold',
              color: white,
            }}
          >
            Preview
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Textarea
              w="full"
              p={2}
              minH="100px"
              maxH="500px"
              _disabled={{ cursor: 'notAllowed' }}
              onChange={(event) => setInput(event.target.value)}
              value={input}
            />
            <HStack alignItems="center" justifyContent="space-between" m={2}>
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
                    <Button bgColor={light} onClick={reset}>
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" disabled={(token && !input.trim()) || isSubmitting}>
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
          <TabPanel px={2} pt={2} pb={4} minH="105px" borderBottomWidth={2}>
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
          <Avatar src={viewer.avatarUrl} width="30" height="30" alt={`@${viewer.login}`} />
        </ChakraLink>
      ) : null}
      <Button
        _hover={{ _pointer: 'text' }}
        width="full"
        bgColor="white"
        color="gray.500"
        onClick={handleReplyOpen}
        type="button"
        borderColor={med}
        borderWidth={1}
      >
        Write a reply
      </Button>
    </HStack>
  )
}
