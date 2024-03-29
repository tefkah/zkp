import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider, signIn, useSession } from 'next-auth/react'
import { AppProps } from 'next/app'
import React from 'react'
import { SWRConfig } from 'swr'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import { CookiesProvider } from 'react-cookie'
import { fetcher } from '../utils/fetchers/fetcher'
import theme from '../theme'
import '../styles/globals.css'
import 'katex/dist/katex.css'

type NextPageWithLayoutAndAuth = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
  auth?: boolean
}

type AppPropsWithLayoutAndAuth = AppProps & {
  Component: NextPageWithLayoutAndAuth
}

export const Auth = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const { data: session, status } = useSession()
  const isUser = !!session?.user
  React.useEffect(() => {
    if (status === 'loading') return // Do nothing while loading
    if (!isUser) signIn() // If not authenticated, force log in
  }, [isUser, status])

  if (isUser) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>
}

export const ZKP = ({ Component, pageProps }: AppPropsWithLayoutAndAuth) => {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <React.StrictMode>
      <CookiesProvider>
        <SessionProvider session={pageProps.session}>
          <SWRConfig value={{ fetcher }}>
            <ChakraProvider theme={theme}>
              {Component.auth ? (
                <Auth>{getLayout(<Component {...pageProps} />)}</Auth>
              ) : (
                getLayout(<Component {...pageProps} />)
              )}
            </ChakraProvider>
          </SWRConfig>
        </SessionProvider>
      </CookiesProvider>
    </React.StrictMode>
  )
}
export default ZKP
