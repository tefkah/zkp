import { Box } from '@chakra-ui/react'
import { Link as ChakraLink } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

interface Props {
  href: string
  children: React.ReactNode
}

const isActive = (slug: string, children: string, href: string) => {
  const isActivity = ['commit', 'compare', 'activity'].includes(
    slug.replace(/\/(.+?)(\/|\b).*/g, '$1'),
  )
  const isDiscussions = slug.startsWith('/discussions')
  switch (children) {
    case 'Thesis':
      return slug.slice(0, 5).match(/(I+V?\.|V+I*\.)/g)
    case 'Activity':
      return isActivity
    case 'Discussions':
      return isDiscussions
    case 'Notes':
      return !slug.slice(1).match(/\//g)
    default:
      return false
  }
}
export const HeaderLink = (props: Props) => {
  const { href, children } = props
  const router = useRouter()
  const active = isActive(router?.asPath, children as string, href)
  return (
    <Link href={href} passHref>
      <ChakraLink
        p={2}
        position="relative"
        _after={{
          content: '" "',
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: 'red.500',
          width: active ? '100%' : 0,
          height: '3px',
          transition: 'all 0.4s',
        }}
        transition="all 0.4s"
        _hover={{ _after: { width: '100%' } }}
      >
        {children}
      </ChakraLink>
    </Link>
  )
}
