import shallow from 'zustand/shallow'
import { Box, Container, HStack, LinkBox, LinkOverlay, Text, Tooltip } from '@chakra-ui/react'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useNotes } from '../../stores/noteStore'

export interface SidebarLinkProps {
  // item: File
  // path: string
  key: string
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
    <Tooltip placement="top" label={name} key={name} openDelay={600} borderWidth={2}>
      <LinkBox
        as={Container}
        py={1}
        borderRadius="sm"
        backgroundColor={isActive ? 'brand.50' : undefined}
        onMouseEnter={() => setHighlightedNote(name)}
        onMouseLeave={() => unHighlightNotes()}
        role="group"
        onClick={(event) => {
          if (!event.altKey) {
            return
          }

          event.preventDefault()
        }}
      >
        <HStack alignItems="baseline">
          {/* <Icon as={BsFileEarmarkText} color={iconColor} mt={1} height={3} /> */}
          <Text
            _groupHover={{ color: 'primary' }}
            fontWeight={isActive ? '600' : '400'}
            // color={isActive ? currentColor : textColor}
            color="gray.800"
            transition="color 0.15s"
            fontSize={14}
            textTransform="capitalize"
            noOfLines={1}
            pl={3}
          >
            {slug ? (
              <Link passHref href={`/${slug}`} key={name}>
                <LinkOverlay href={`/${slug}`} tabIndex={0}>
                  <Text as="span" tabIndex={0}>
                    {name}
                  </Text>
                </LinkOverlay>
              </Link>
            ) : (
              { name }
            )}
          </Text>
        </HStack>
      </LinkBox>
    </Tooltip>
  )
}

SidebarLink.defaultProps = { slug: undefined }
