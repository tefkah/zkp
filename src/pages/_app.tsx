import '@fontsource/eb-garamond/400.css'

import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'

import theme from '../theme'
import { AppProps } from 'next/app'
import React from 'react'
import { SWRConfig } from 'swr'
import fetcher from '../utils/fetcher'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <SessionProvider session={pageProps.session}>
      <SWRConfig value={{ fetcher }}>
        <ChakraProvider resetCSS theme={theme}>
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </SWRConfig>
    </SessionProvider>
  )
}
