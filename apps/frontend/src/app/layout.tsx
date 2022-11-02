import Link from 'next/link'
// import { Inter } from '@next/font/google'
import '../styles/globals.css'
import 'katex/dist/katex.css'
import Nav from './Nav'

// const roboto = Inter({ subsets: ['latin'] })

const RootLayout = async ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <head></head>
    <body className="w-screen">
      <Nav />

      {children}
    </body>
  </html>
)

export default RootLayout
