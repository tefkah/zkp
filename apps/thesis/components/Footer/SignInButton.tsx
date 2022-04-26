import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'
import { FaGithub } from 'react-icons/fa'
import { Button } from '@chakra-ui/react'

export const SignInButton = () => {
  const { data: user } = useSession()
  if (!user) {
    return (
      <Button size="sm" variant="link" leftIcon={<FaGithub />} onClick={() => signIn()}>
        Supervisor login
      </Button>
    )
  }
  return (
    <Button size="sm" variant="link" leftIcon={<FaGithub />} onClick={() => signOut()}>
      Sign out
    </Button>
  )
}
