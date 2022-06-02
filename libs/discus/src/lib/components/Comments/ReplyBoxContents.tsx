import { HStack, Avatar, Button, Link as ChakraLink } from '@chakra-ui/react'
import { IUser } from '@zkp/types'

export interface ReplyBoxContentsProps {
  viewer?: IUser
  handleReplyOpen: () => void
}

export const ReplyBoxContents = ({ viewer, handleReplyOpen }: ReplyBoxContentsProps) => {
  return (
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
          className="flex flex-shrink-0 items-center"
        >
          <Avatar
            src={viewer.avatarUrl}
            width="30"
            height="30" // alt={`@${viewer.login}`}
          />
        </ChakraLink>
      ) : null}
      <Button
        _hover={{
          _pointer: 'text',
        }}
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
