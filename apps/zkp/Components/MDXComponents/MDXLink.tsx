import Link from 'next/link'
import { ReactNode } from 'react'
import { Text } from '@chakra-ui/react'
import { PreviewLink } from '../FileViewer'
import { MDXComp } from './types'

export const MDXLinkBase: MDXComp<'a'> = (
  props: React.ComponentProps<'a'> & { currentId: string; alias?: string },
) => {
  const { href, className, alias, children, currentId, ...rest } = props
  if (href?.includes('http')) {
    type NewType = ReactNode

    return (
      <Link href={href as string} passHref>
        <a href={href}>{children as NewType}</a>
      </Link>
    )
  }

  if (['footnum', 'footref'].includes(className as string)) {
    return (
      // @ts-expect-error yeah yeah text is not a span
      <Text {...{ ...rest }} variant="org" as="span" fontWeight="bold" color="primary">
        <Link href={href as string}>
          <a href={href}>{children as ReactNode}</a>
        </Link>
      </Text>
    )
  }

  const title = alias
  return <a href={href}>{href}</a>
  return (
    <PreviewLink
      currentId={currentId}
      title={title}
      href={`/${(href as string).replace('#/page', '')}`}
    >
      {children}
    </PreviewLink>
  )
}
