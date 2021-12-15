import Header from '../Header/'
import Footer from '../Footer'
import Head from 'next/head'
import { useSession } from 'next-auth/react'

export interface BasicLayoutProps {
  children: React.ReactElement
}
export default function BasicLayout(props: BasicLayoutProps) {
  const { children } = props
  const { data: session } = useSession()
  return (
    <>
      <Header user={session?.user?.email as string} />
      <main>
        {children}
        <Footer user={session?.user?.email as string} />
      </main>
    </>
  )
}
