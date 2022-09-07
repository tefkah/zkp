import shallow from 'zustand/shallow'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useNotes } from '../../stores/noteStore'

export interface SidebarLinkProps {
  // item: File
  // path: string
  // currentColor: string
  //
  // textColor: string
  name: string
  slug?: string
}

export const SidebarLink = ({ slug, name }: SidebarLinkProps) => {
  const { asPath: path } = useRouter()

  const isActive = path.includes(`/${slug}`)
  const [setHighlightedNote, unHighlightNotes] = useNotes(
    (state) => [state.setHighlightedNote, state.unHighlightNotes],
    shallow,
  )
  // TODO: Actually make this keyboard navigable
  return slug ? (
    <Link href={`/${slug}`} passHref>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        onMouseEnter={() => setHighlightedNote(name)}
        onMouseLeave={() => unHighlightNotes()}
        className={`w-full py-[2px] hover:text-red-500 ${
          isActive ? 'bg-red-50 font-bold' : 'font-light'
        } truncate pl-8 text-sm capitalize transition-colors`}
      >
        {name}
      </a>
    </Link>
  ) : (
    <p>{name}</p>
  )
}

/*
    // <Tooltip placement="top" label={name} key={name} openDelay={600} borderWidth={2}>
      // <div
      //   className={`rounded-sm py-1 ${isActive ? 'red-50' : undefined}`}
      //   // as={Container}
      //   // py={1}
      //   // borderRadius="sm"
      //   // backgroundColor=
      //   role="group"
      //   // onClick={(event) => {
      //   //   if (!event.altKey) {
      //   //     return
      //   //   }

      //   //   event.preventDefault()
      //   // }}
      // >
         <p
          className={`group-hover:text-red-500 ${
            isActive ? 'font-bold' : 'font-regular'
          } truncate pl-3 text-sm capitalize transition-colors`}
          //            _groupHover={{ color: 'primary' }}
          //           fontWeight={isActive ? '600' : '400'}
          // color={isActive ? currentColor : textColor}
          // color="gray.800"
          //          transition="color 0.15s"
          //         fontSize={14}
          //        textTransform="capitalize"
          //       noOfLines={1}
          //      pl={3}
        >
        </p>
       </div>
     // </Tooltip>
    */

SidebarLink.defaultProps = { slug: undefined }
