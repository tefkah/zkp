import { SmileyIcon } from '@primer/octicons-react'
import { useCallback, useContext, useState } from 'react'
import { IReactionGroups } from '../../lib/adapter'
import { Reaction, Reactions } from '../../utils/giscus/reactions'
import { toggleReaction } from '../../services/github/toggleReaction'
import { signIn, useSession } from 'next-auth/react'
import {
  Text,
  Box,
  Button,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from '@chakra-ui/react'

interface IReactButtonsProps {
  reactionGroups: IReactionGroups
  subjectId?: string
  onReact: (content: Reaction, promise: Promise<unknown>) => void
  variant?: 'groupsOnly' | 'popoverOnly' | 'all'
  onDiscussionCreateRequest?: () => Promise<string>
}

function PopupInfo({
  isLoggedIn,
  isLoading,
  current,
}: {
  isLoggedIn: boolean
  isLoading: boolean
  current: Reaction
}) {
  if (isLoading) return <Text className="m-2">Please wait</Text>
  if (!isLoggedIn) return <Button onClick={() => signIn()} className="color-text-link" />
  return null
}

export default function ReactButtons({
  reactionGroups,
  subjectId,
  onReact,
  variant = 'all',
  onDiscussionCreateRequest,
}: IReactButtonsProps) {
  const [current, setCurrent] = useState<Reaction | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isOpen, onOpen, onToggle } = useDisclosure()
  const { data: session } = useSession()
  const token = session?.accessToken as string

  const react = useCallback(
    async (content: Reaction) => {
      if (isSubmitting || (!subjectId && !onDiscussionCreateRequest)) return
      setIsSubmitting(!subjectId)

      const id =
        subjectId && onDiscussionCreateRequest ? subjectId : await onDiscussionCreateRequest!()

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
        aria-label={'add reaction' + key}
        key={key}
        className={`gsc-direct-reaction-Button gsc-social-reaction-summary-item ${
          viewerHasReacted ? 'has-reacted' : ''
        }${!token ? ' cursor-not-allowed' : ''}`}
        disabled={!token}
        title={token ? 'People reacted with' + count : 'You must be signed in to add reactions'}
        onClick={() => react(key)}
      >
        <Text as="span" className="inline-block w-4 h-4">
          {Reactions[key]}
        </Text>
        <Text as="span" className="text-xs ml-[2px] px-1">
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
          //@ts-expect-error
          .map(createReactionButton)
      : []

  return (
    <>
      {variant !== 'groupsOnly' ? (
        <Popover>
          <PopoverTrigger>
            <Button
              aria-label={'Add Reactions'}
              px="5px"
              py="3px"
              er={2}
              leading="inherit"
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
                //loginUrl={loginUrl}
                current={current!}
              />
              {Object.entries(Reactions).map(([key, emoji]) => (
                <Button
                  variant="ghost"
                  aria-label={'addTheReaction' + (key as Reaction)}
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
        <Box className="gsc-direct-reaction-Buttons">{directReactionButtons}</Box>
      ) : null}
    </>
  )
}
