/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/display-name */
import {
  Link as ChakraLink,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  Portal,
  Text,
  Container,
  PopoverTrigger as OrigPopoverTrigger,
} from '@chakra-ui/react'
import React from 'react'

import 'katex/dist/katex.css'

import { ExternalLinkIcon } from '@chakra-ui/icons'
import { PopoverPreview } from './PopoverPreview'
import { NodeLink } from '../Link/NodeLink'

export const PopoverTrigger: React.FC<{ children: React.ReactNode }> = OrigPopoverTrigger
export interface LinkProps {
  backlink?: boolean
  title?: string
  href: any
  children: any
  currentId: string
}

export interface NormalLinkProps {
  href: string
  children: string
}

export const NormalLink = (props: NormalLinkProps) => {
  const { href, children } = props
  // const { highlightColor } = useContext(ThemeContext)
  return (
    <ChakraLink isExternal href={href}>
      {children}
      <ExternalLinkIcon mx="1px" pb="2px" />
    </ChakraLink>
  )
}

export const PreviewLink = (props: LinkProps) => {
  const { backlink, href, title, children, currentId } = props
  //  const { data: text } = useSWR(backlink ? `/api/file/byId/${id}` : null)

  if (!href) {
    return (
      <Text as="span" display="inline" className={href} color="base.700" cursor="not-allowed">
        {children}
      </Text>
    )
  }

  return (
    <Popover
      closeOnEsc
      gutter={12} // openDelay={300}
      trigger="hover"
      placement="bottom-start"
      isLazy
      lazyBehavior="keepMounted"

      // isLazy
    >
      <PopoverTrigger>
        {backlink ? null : (
          /* <Box sx={noteStyle} color="brand.700">
            <NodeLink key={title} currentId={currentId} href={href}>
              {children}
            </NodeLink>
            <ParsedOrg type="popover" text={text?.file} currentId={currentId} />
        </Box> */

          <Text as="span">
            <NodeLink key={title} currentId={currentId} href={href}>
              {children}
            </NodeLink>
          </Text>
        )}
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          boxShadow="md"
          key={href}
          // position="relative" // zIndex="tooltip"
        >
          <PopoverArrow />
          <PopoverBody
            as={Container}
            pb={5}
            fontSize="xs"
            maxW="xs"
            // zIndex="tooltip"
            maxH="2xs"
            overflowY="scroll"
            borderRadius="sm"
          >
            <PopoverPreview {...{ href, id: currentId }} />
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
