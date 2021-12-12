import { Box } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

interface Props {
  href: string
  children: React.ReactNode
}

export const HeaderLink = (props: Props) => {
  const { href, children } = props
  return (
    <Box
      p={2}
      position="relative"
      _after={{
        content: '" "',
        position: 'absolute',
        bottom: 0,
        left: 2,
        backgroundColor: 'red.500',
        width: 0,
        height: '3px',
        transition: 'all 0.4s',
      }}
      transition="all 0.4s"
      _hover={{ _after: { width: '90%' } }}
    >
      <Link href={href}>{children}</Link>
    </Box>
  )
}
