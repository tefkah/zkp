import { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

const CustomApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>Welcome to zkp!</title>
    </Head>
    <main className="app">
      <Component {...pageProps} />
    </main>
  </>
)

export default CustomApp
