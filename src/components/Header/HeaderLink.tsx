import { Box } from '@chakra-ui/react'
import { Link as ChakraLink } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

interface Props {
  href: string
  children: React.ReactNode
  dontFetch?: boolean
}

const isActive = (slug: string, children: string, href: string) => {
  const isActivity = ['commit', 'compare', 'activity'].includes(
    slug.replace(/\/(.+?)(\/|\b).*/g, '$1'),
  )
  const isDiscussions = slug.startsWith('/discussions')
  const isThesis = slug.slice(0, 5).match(/(I+V?\.|V+I*\.)/g)
  switch (children) {
    case 'Thesis':
      return isThesis
    case 'Activity':
      return isActivity
    case 'Discussions':
      return isDiscussions
    case 'Notes':
      return (
        !slug.slice(1).match(/\//g) && !isDiscussions && !isActivity && !isThesis && slug !== '/'
      )
    default:
      return false
  }
}
export const HeaderLink = (props: Props) => {
  const { href, children, dontFetch } = props
  const router = useRouter()
  const active = isActive(router?.asPath, children as string, href)
  return (
    <Link href={href} passHref prefetch={!dontFetch}>
      <ChakraLink
        p={2}
        position="relative"
        _after={{
          content: '" "',
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: 'primary',
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
