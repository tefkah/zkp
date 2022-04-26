import shallow from 'zustand/shallow'
import { Container, HStack, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useNotes } from '../../stores/noteStore'

export interface SidebarLinkProps {
  // item: File
  // path: string
  // key: string
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
  return (
    <LinkBox
      as={Container}
      py={1}
      key={name}
      borderRadius="sm"
      backgroundColor={isActive ? 'brand.50' : undefined}
      onMouseEnter={() => setHighlightedNote(name)}
      onMouseLeave={() => unHighlightNotes()}
      role="group"
    >
      <HStack alignItems="baseline">
        {/* <Icon as={BsFileEarmarkText} color={iconColor} mt={1} height={3} /> */}
        <Text
          _groupHover={{ color: 'primary' }}
          fontWeight={isActive ? '600' : '500'}
          // color={isActive ? currentColor : textColor}
          transition="color 0.15s"
          fontSize={14}
          textTransform="capitalize"
        >
          {slug ? (
            <Link passHref prefetch={false} href={`/${slug}`} key={name}>
              <LinkOverlay>
                <Text>{name}</Text>
              </LinkOverlay>
            </Link>
          ) : (
            <Text>{name}</Text>
          )}
        </Text>
      </HStack>
    </LinkBox>
  )
}

SidebarLink.defaultProps = { slug: undefined }
