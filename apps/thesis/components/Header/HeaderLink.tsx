// import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

interface Props {
  href: string
  children: React.ReactNode
}

/**
 * TODO: Figure out a more modular way to check whether a heading is active
 */
const isActive = (slug: string, children: string) => {
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
  const { href, children } = props
  const router = useRouter()
  const active = isActive(router?.asPath, children as string)
  return (
    //  <Link href={href} passHref>
    <a
      href={href}
      className={`after:contents-[" "] relative p-2 after:absolute after:bottom-0 after:left-0 after:bg-red-500 ${
        active ? 'after:w-full' : 'after:w-0'
      }  transition-all duration-300 after:h-1 after:transition-all hover:after:w-full`}
      // _hover={{ _after: { width: '100%' } }}
    >
      {children}
    </a>
    // </Link>
  )
}
