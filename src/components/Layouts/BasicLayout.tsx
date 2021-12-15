import Header from '../Header/'
import Footer from '../Footer'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { Box } from '@chakra-ui/react'

export interface BasicLayoutProps {
  children: React.ReactElement
}
export default function BasicLayout(props: BasicLayoutProps) {
  const { children } = props
  const { data: session } = useSession()
  return (
    <>
      <Header user={session?.user?.email as string} />

      <Box w="100vw" h="100vh" overflowX="hidden" style={{ scrollBehavior: 'smooth' }}>
        <main>{children}</main>
        <Footer user={session?.user?.email as string} />
      </Box>
    </>
  )
}
