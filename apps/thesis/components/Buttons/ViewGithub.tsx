import { useColorModeValue, Text, HStack } from '@chakra-ui/react'
import Link from 'next/link'
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
        <Link
          // TODO: Update viewgithub button with environment var
          href={
            // eslint-disable-next-line no-nested-ternary
            full
              ? slug
              : repo
              ? `https://github.com/ThomasFKJorna/${repo}/${slug}`
              : `https://github.com/ThomasFKJorna/thesis-writing/${slug}`
          }
          passHref
        >
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="flex gap-2">
            <FaGithub />
            {text && (
              <Text fontSize="xs" fontWeight="bold" as="span">
                {text}
              </Text>
            )}
          </a>
        </Link>
      </HStack>
    </Text>
  )
}
