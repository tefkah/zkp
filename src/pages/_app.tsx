import '@fontsource/eb-garamond/400.css'

import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'

import theme from '../theme'
import { AppProps } from 'next/app'
import React from 'react'
import { SWRConfig } from 'swr'
import fetcher from '../utils/fetcher'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <SWRConfig value={{ fetcher }}>
        <ChakraProvider resetCSS theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </SWRConfig>
    </SessionProvider>
  )
}

export default MyApp
