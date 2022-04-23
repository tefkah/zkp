import shallow from 'zustand/shallow'
import { Container, HStack, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'
import React from 'react'
import Link from 'next/link'
import { File } from '../../types/notes'
import { slugify } from '../../utils/slug'
import { useNotes } from '../../stores/noteStore'

export interface SidebarLinkProps {
  item: File
  path: string
  key: string
  currentColor: string
  textColor: string
}
export const SidebarLink = ({ currentColor, textColor, item, path, key }: SidebarLinkProps) => {
  const isActive = path.includes(`/${slugify(item.path)}`)
  const [setHighlightedNote, unHighlightNotes] = useNotes(
    (state) => [state.setHighlightedNote, state.unHighlightNotes],
    shallow,
  )
  return (
    <LinkBox
      as={Container}
      py={1}
      key={key}
      borderRadius="sm"
      backgroundColor={isActive ? 'brand.50' : undefined}
      onMouseEnter={() => setHighlightedNote(item.id)}
      onMouseLeave={() => unHighlightNotes()}
      role="group"
    >
      <HStack alignItems="baseline">
        {/* <Icon as={BsFileEarmarkText} color={iconColor} mt={1} height={3} /> */}
        <Text
          _groupHover={{ color: 'primary' }}
          fontWeight={isActive ? '600' : '500'}
          color={isActive ? currentColor : textColor}
          transition="color 0.15s"
          fontSize={14}
          textTransform="capitalize"
        >
          <Link passHref prefetch={false} href={`/${slugify(item.path)}`} key={item.path}>
            <LinkOverlay>
              {item.path
                .replace(/\d{14}-/g, '')
                .replace(/\.org/g, '')
                .replace(/_/g, ' ')}
            </LinkOverlay>
          </Link>
        </Text>
      </HStack>
    </LinkBox>
  )
}
