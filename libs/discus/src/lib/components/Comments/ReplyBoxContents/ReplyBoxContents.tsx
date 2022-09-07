import { Avatar, Link as ChakraLink } from '@chakra-ui/react'
import { IUser } from '@zkp/types'
import { Button } from '@zkp/ui'
import Image from 'next/image'
import Link from 'next/link'

export interface ReplyBoxContentsProps {
  viewer?: IUser
  handleReplyOpen: () => void
}

export const ReplyBoxContents = ({ viewer, handleReplyOpen }: ReplyBoxContentsProps) => {
  return (
    <div
      // px={4}
      // py={2}
      // borderTopWidth="1"
      // borderRadius="md"
      className="color-bg-tertiary gsc-reply-box flex gap-2 rounded-md border-t-2 px-4 py-2"
    >
      {viewer ? (
        <Link
          // isExternal
          // display="flex"
          // alignItems="center"
          // justifyContent="center"
          // flexShrink={0}
          href={viewer.url}
          passHref
        >
          <a className="flex flex-shrink-0 items-center rounded-full">
            <Image
              src={viewer.avatarUrl}
              width="30"
              height="30" // alt={`@${viewer.login}`}
              className="rounded-full"
            />
          </a>
        </Link>
      ) : null}
      <Button
        className="w-full border-2 border-slate-100 bg-white text-slate-400"
        // _hover={{
        //   _pointer: 'text',
        // }}
        // width="full"
        // bgColor="white"
        // color="gray.500"
        onClick={handleReplyOpen}
        type="button"
        // borderColor="back"
        // borderWidth={1}
      >
        Write a reply
      </Button>
    </div>
  )
}
