// import { Inter } from '@next/font/google'
import '../styles/globals.css'
import 'katex/dist/katex.css'
import Nav from './Nav'
import { Footer } from './Footer'
import AuthContext from './AuthContext'

// const roboto = Inter({ subsets: ['latin'] })

const RootLayout = async ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <head></head>
    <body className="w-screen bg-rose-50">
      <AuthContext>
        <Nav />

        {children}
        <Footer />
      </AuthContext>
    </body>
  </html>
)

export default RootLayout
