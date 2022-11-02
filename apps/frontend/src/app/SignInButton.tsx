'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { FaGithub } from 'react-icons/fa'

export const SignInButton = () => {
  // const { data: user } = useSession()
  const { data: user } = useSession()
  if (!user) {
    return (
      <button type="button" className="flex gap-2" onClick={() => signIn()}>
        <FaGithub />
        Supervisor login
      </button>
    )
  }
  return (
    <button type="button" onClick={() => signOut()} className="flex gap-2">
      <FaGithub />
      Sign out
    </button>
  )
}
