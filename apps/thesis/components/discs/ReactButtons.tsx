// ported from the great https://github.com/giscus/giscus

import { SmileyIcon } from '@primer/octicons-react'
import { useCallback, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import {
  Text,
  Button,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  HStack,
} from '@chakra-ui/react'
import { IReactionGroups } from '../../types/adapter'
import { Reaction, Reactions } from '../../types/github'
import { toggleReaction } from '../../services/github/toggleReaction'

interface IReactButtonsProps {
  reactionGroups: IReactionGroups
  subjectId?: string
  onReact: (content: Reaction, promise: Promise<unknown>) => void
  variant?: 'groupsOnly' | 'popoverOnly' | 'all'
  onDiscussionCreateRequest?: () => Promise<string>
}

const PopupInfo = ({
  isLoggedIn,
  isLoading,
  current,
}: {
  isLoggedIn: boolean
  isLoading: boolean
  current: Reaction
}) => {
  if (isLoading) return <Text className="m-2">Please wait</Text>
  if (!isLoggedIn) return <Button onClick={() => signIn()} className="color-text-link" />
  return null
}

type ReactionsMap = [key: Reaction, emoji: typeof Reactions[Reaction]]
export const ReactButtons = ({
  reactionGroups,
  subjectId,
  onReact,
  variant = 'all',
  onDiscussionCreateRequest,
}: IReactButtonsProps) => {
  const [current, setCurrent] = useState<Reaction | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { onToggle } = useDisclosure()
  const { data: session } = useSession()
  const token = session?.accessToken as string

  const react = useCallback(
    async (content: Reaction) => {
      if (isSubmitting || (!subjectId && !onDiscussionCreateRequest)) return
      setIsSubmitting(!subjectId)

      const id = subjectId || (await onDiscussionCreateRequest!())

      onReact(
        content,
        toggleReaction(
          { content, subjectId: id },
          token,
          !!reactionGroups?.[content]?.viewerHasReacted,
        ).then(() => setIsSubmitting(false)),
      )
    },
    [isSubmitting, onDiscussionCreateRequest, onReact, reactionGroups, subjectId, token],
  )

  const createReactionButton = useCallback(
    ([key, { count, viewerHasReacted }]: [Reaction, typeof reactionGroups[Reaction]]) => (
      <Button
        aria-label={`add reaction${key}`}
        key={key}
        className={`gsc-direct-reaction-Button gsc-social-reaction-summary-item ${
          viewerHasReacted ? 'has-reacted' : ''
        }${!token ? ' cursor-not-allowed' : ''}`}
        borderRadius="xl"
        size="sm"
        variant="ghost"
        type="button"
        pb={2}
        pt={3}
        mt="-1px"
        borderWidth={reactionGroups?.[key]?.viewerHasReacted ? 1 : 0}
        cursor={!token ? 'not-allowed' : undefined}
        disabled={!token}
        title={token ? `People reacted with${count}` : 'You must be signed in to add reactions'}
        onClick={() => react(key)}
        alignItems="center"
      >
        <Text as="span" w={4} pr={4} h={4} display="inline-block">
          {Reactions[key]}
        </Text>
        <Text as="span" fontSize="sm" ml="2px" px={1} className="text-xs ml-[2px] px-1">
          {count}
        </Text>
      </Button>
    ),
    [react, token],
  )

  const directReactionButtons =
    variant !== 'popoverOnly'
      ? Object.entries(reactionGroups || {})
          .filter(([, { count }]) => count > 0)
          .map(createReactionButton)
      : []

  return (
    <>
      {variant !== 'groupsOnly' ? (
        <Popover>
          <PopoverTrigger>
            <Button
              aria-label="Add Reactions"
              px="5px"
              py="3px"
              mr={2}
              borderRadius="full"
              size="sm"
              className={`link-secondary gsc-reactions-Button gsc-social-reaction-summary-item ${
                variant === 'popoverOnly' ? 'popover-only' : 'popover'
              }`}
              onClick={onToggle}
            >
              <SmileyIcon size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent mx={2} zIndex="popover" position="relative">
            <PopoverArrow />
            <PopoverBody
              zIndex="popover"
              position="relative"
              className="m-2"
              px={3}
              leading="24px"
              whiteSpace="nowrap"
            >
              <PopupInfo
                isLoading={isSubmitting}
                isLoggedIn={!!token}
                // loginUrl={loginUrl}
                current={current!}
              />
              {(Object.entries(Reactions) as ReactionsMap[]).map(([key, emoji]: ReactionsMap) => (
                <Button
                  variant="ghost"
                  aria-label={`addTheReaction${key as Reaction}`}
                  key={key}
                  type="button"
                  w={8}
                  h={8}
                  mr="-1px"
                  mt="-1px"
                  borderWidth={reactionGroups?.[key]?.viewerHasReacted ? 1 : 0}
                  className={`gsc-emoji-Button${
                    reactionGroups?.[key]?.viewerHasReacted
                      ? ' has-reacted color-bg-info color-border-tertiary'
                      : ''
                  }${!token ? ' no-token' : ''}`}
                  onClick={() => {
                    react(key as Reaction)
                    onToggle()
                  }}
                  onMouseEnter={() => setCurrent(key as Reaction)}
                  onFocus={() => setCurrent(key as Reaction)}
                  onMouseLeave={() => setCurrent(null)}
                  onBlur={() => setCurrent(null)}
                  disabled={!token}
                >
                  <Text as="span" className="gsc-emoji">
                    {emoji}
                  </Text>
                </Button>
              ))}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      ) : null}

      {variant !== 'popoverOnly' ? (
        <HStack spacing={2} className="gsc-direct-reaction-Buttons">
          {directReactionButtons}
        </HStack>
      ) : null}
    </>
  )
}
