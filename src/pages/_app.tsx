import '@fontsource/eb-garamond/400.css'

import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider, signIn, useSession } from 'next-auth/react'

import theme from '../theme'
import { AppProps } from 'next/app'
import React from 'react'
import { SWRConfig } from 'swr'
import fetcher from '../utils/fetcher'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'

type NextPageWithLayoutAndAuth = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
  auth?: boolean
}

type AppPropsWithLayoutAndAuth = AppProps & {
  Component: NextPageWithLayoutAndAuth
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayoutAndAuth) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <SessionProvider session={pageProps.session}>
      <SWRConfig value={{ fetcher }}>
        <ChakraProvider resetCSS theme={theme}>
          {Component.auth ? (
            <Auth>{getLayout(<Component {...pageProps} />)}</Auth>
          ) : (
            getLayout(<Component {...pageProps} />)
          )}
        </ChakraProvider>
      </SWRConfig>
    </SessionProvider>
  )
}

export function Auth({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const isUser = !!session?.user
  React.useEffect(() => {
    if (status === 'loading') return // Do nothing while loading
    if (!isUser) signIn() // If not authenticated, force log in
  }, [isUser, status])

  if (isUser) {
    return <>{children}</>
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>
}
