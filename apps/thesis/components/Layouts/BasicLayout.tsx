import { Box } from '@chakra-ui/react'
import Header from '../Header'
import Footer from '../Footer'

export interface BasicLayoutProps {
  children: React.ReactElement
}
export const BasicLayout = (props: BasicLayoutProps) => {
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

export default BasicLayout
