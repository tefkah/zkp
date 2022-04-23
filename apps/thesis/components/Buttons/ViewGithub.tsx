import { useColorModeValue, Text, HStack, Link, LinkOverlay } from '@chakra-ui/react'
import React from 'react'
import { FaGithub } from 'react-icons/fa'

interface Props {
  text?: string
  slug: string
  repo?: string
  full?: boolean
}

export const ViewGithub = (props: Props) => {
  const { text, full, slug, repo } = props
  return (
    <Text
      color={useColorModeValue('gray.500', 'gray.400')}
      _hover={{ color: useColorModeValue('black', 'white') }}
      transition="color 0.1s"
    >
      <HStack as="span">
        <LinkOverlay
          isExternal
          href={
            full
              ? slug
              : repo
              ? `https://github.com/ThomasFKJorna/${repo}/${slug}`
              : `https://github.com/ThomasFKJorna/thesis-writing/${slug}`
          }
        >
          <FaGithub />
        </LinkOverlay>
        {text && (
          <Text fontSize="xs" fontWeight="bold" as="span">
            {text}
          </Text>
        )}
      </HStack>
    </Text>
  )
}
