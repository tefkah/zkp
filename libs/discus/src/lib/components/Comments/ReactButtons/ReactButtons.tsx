// ported from the great https://github.com/giscus/giscus

import { SmileyIcon } from '@primer/octicons-react'
import { useCallback, useMemo, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import {
  Text,
  Button,
  useDisclosure,
  Popover as ChakraPopover,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverTrigger as OrigPopoverTrigger,
} from '@chakra-ui/react'
import { IReactionGroups, Reaction, Reactions } from '@zkp/types'
import { toggleReaction } from '../../../services/github/toggleReaction'
import { Popover } from '@zkp/popover'

export const PopoverTrigger: React.FC<{ children: React.ReactNode }> = OrigPopoverTrigger
export interface ReactButtonsProps {
  reactionGroups: IReactionGroups
  subjectId?: string
  onReact: (content: Reaction, promise: Promise<unknown>) => void
  variant?: 'groupsOnly' | 'popoverOnly' | 'all'
  onDiscussionCreateRequest?: () => Promise<string>
}

const PopupInfo = ({
  isLoggedIn,
  isLoading,
}: //  current,
{
  isLoggedIn: boolean
  isLoading: boolean
  //  current: Reaction
}) => {
  // console.log(current)
  if (isLoading) return <p className="m-2">Please wait</p>
  if (!isLoggedIn)
    return (
      <button title="Log In" type="button" onClick={() => signIn()} className="color-text-link" />
    )
  return null
}

type ReactionsMap = [key: Reaction, emoji: typeof Reactions[Reaction]]
type ReactionGroupsMap = [keyof IReactionGroups, IReactionGroups[keyof IReactionGroups]]

export const ReactButtons = ({
  reactionGroups,
  subjectId,
  onReact,
  variant = 'all',
  onDiscussionCreateRequest,
}: ReactButtonsProps) => {
  // const [current, setCurrent] = useState<Reaction | null>(null)
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
      <button
        aria-label={`add reaction ${key}`}
        key={key}
        className={`gsc-direct-reaction-button gsc-social-reaction-summary-item ${
          viewerHasReacted ? 'has-reacted' : ''
        }${!token ? ' cursor-not-allowed' : ''}`}
        // borderRadius="xl"
        // size="sm"
        // variant="ghost"
        type="button"
        // pb={2}
        // pt={3}
        // mt="-1px"
        // borderWidth={reactionGroups?.[key]?.viewerHasReacted ? 1 : 0}
        // cursor={!token ? 'not-allowed' : undefined}
        // disabled={!token}
        title={token ? `People reacted with${count}` : 'You must be signed in to add reactions'}
        onClick={() => react(key)}
        // alignItems="center"
      >
        <span className="inline-block h-4 w-4 pr-4">{Reactions[key]}</span>
        <span className="ml-[2px] px-1 text-xs">{count}</span>
      </button>
    ),
    [react, token],
  )

  const directReactionButtons =
    variant !== 'popoverOnly'
      ? (Object.entries(reactionGroups || {}) as ReactionGroupsMap[])
          .filter(([, { count }]) => count > 0)
          .map(createReactionButton)
      : []

  const reactions = useMemo(
    () => (
      <>
        {(Object.entries(Reactions) as ReactionsMap[]).map(([key, emoji]: ReactionsMap) => (
          <button
            aria-label={`addTheReaction${key as Reaction}`}
            key={key}
            type="button"
            // w={8}
            // h={8}
            // mr="-1px"
            // mt="-1px"
            // borderWidth={reactionGroups?.[key]?.viewerHasReacted ? 1 : 0}
            className={`gsc-emoji-button ${
              reactionGroups?.[key]?.viewerHasReacted
                ? ' has-reacted color-bg-info color-border-tertiary'
                : ''
            }${!token ? ' no-token' : ''}`}
            onClick={() => {
              react(key as Reaction)
              // onToggle()
            }}
            disabled={!token}
          >
            <span className="gsc-emoji">{emoji}</span>
          </button>
        ))}
      </>
    ),
    [token, reactionGroups, Reactions],
  )

  if (variant === 'groupsOnly') {
    return <div className="gsc-direct-reaction-buttons flex space-x-2">{directReactionButtons}</div>
  }
  return (
    <div>
      <Popover
        // portal={false}
        // hover
        title={<SmileyIcon size={16} />}
        // button={{
        //   'aria-label': 'Add Reactions',
        //   className: `link-secondary gsc-reactions-button gsc-social-reaction-summary-item ${
        //     variant === 'popoverOnly' ? 'popover-only' : 'popover'
        //   }`,
        //   children: <SmileyIcon size={16} />,
        // }}
      >
        <div className="space-x-2 whitespace-nowrap rounded-sm bg-slate-100 p-2 px-3">
          {/* <PopupInfo
          isLoading={isSubmitting}
          isLoggedIn={!!token}
          // loginUrl={loginUrl}
          //     current={current!}
        /> */}
          {reactions}
        </div>
      </Popover>
    </div>
  )
  return (
    <ChakraPopover>
      <PopoverTrigger>
        <button
          type="button"
          aria-label="Add Reactions"
          // px="5px"
          // py="3px"
          // mr={2}
          // borderRadius="full"
          // size="sm"
          className={`link-secondary gsc-reactions-button gsc-social-reaction-summary-item ${
            variant === 'popoverOnly' ? 'popover-only' : 'popover'
          }`}
          onClick={onToggle}
        >
          <SmileyIcon size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent mx={2} zIndex="popover" position="relative">
        <PopoverArrow />
        <PopoverBody
          zIndex="popover"
          position="relative"
          className="m-2 space-x-2 whitespace-nowrap rounded-sm bg-slate-100 px-3"
        >
          <PopupInfo
            isLoading={isSubmitting}
            isLoggedIn={!!token}
            // loginUrl={loginUrl}
            //     current={current!}
          />
          {(Object.entries(Reactions) as ReactionsMap[]).map(([key, emoji]: ReactionsMap) => (
            <button
              // variant="ghost"
              aria-label={`addTheReaction${key as Reaction}`}
              key={key}
              type="button"
              // w={8}
              // h={8}
              // mr="-1px"
              // mt="-1px"
              // borderWidth={reactionGroups?.[key]?.viewerHasReacted ? 1 : 0}
              className={`gsc-emoji-button ${
                reactionGroups?.[key]?.viewerHasReacted
                  ? ' has-reacted color-bg-info color-border-tertiary'
                  : ''
              }${!token ? ' no-token' : ''}`}
              onClick={() => {
                react(key as Reaction)
                onToggle()
              }}
              // onMouseEnter={() => setCurrent(key as Reaction)}
              // onFocus={() => setCurrent(key as Reaction)}
              // onMouseLeave={() => setCurrent(null)}
              // onBlur={() => setCurrent(null)}
              disabled={!token}
            >
              <span className="gsc-emoji">{emoji}</span>
            </button>
          ))}
        </PopoverBody>
      </PopoverContent>
    </ChakraPopover>
  )
}
