'use client'

import { SessionProvider } from 'next-auth/react'

export interface AuthContextProps {
  children: React.ReactNode
}

const AuthContext = ({ children }: AuthContextProps) => (
  <SessionProvider>{children}</SessionProvider>
)
export default AuthContext
