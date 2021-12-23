import Header from '../Header/'
import Footer from '../Footer'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { Box } from '@chakra-ui/react'
import { useEffect } from 'react'

export interface BasicLayoutProps {
  children: React.ReactElement
}
export default function BasicLayout(props: BasicLayoutProps) {
  const { children } = props

  return (
    <>
      <Header />

      <Box w="100vw" h="95vh" overflowX="hidden" style={{ scrollBehavior: 'smooth' }}>
        {children}
        <Footer />
      </Box>
    </>
  )
}
