import { useColorModeValue, Text, HStack, Link } from '@chakra-ui/react'
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
      <Link
        isExternal
        href={
          full
            ? slug
            : repo
            ? `https://github.com/ThomasFKJorna/${repo}/${slug}`
            : `https://github.com/ThomasFKJorna/thesis-writing/${slug}`
        }
      >
        <HStack as="span">
          <FaGithub />
          {text && (
            <Text size="xs" fontWeight="bold" as="span">
              {text}
            </Text>
          )}
        </HStack>
      </Link>
    </Text>
  )
}
