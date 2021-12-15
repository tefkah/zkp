import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'
import { FaGithub } from 'react-icons/fa'
import { Button } from '@chakra-ui/react'

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'
interface Props {
  user: string
  allowedEmails: string[]
}

export const SignInButton = (props: Props) => {
  const { user, allowedEmails } = props
  if (!user) {
    return (
      <Button size="sm" variant="link" leftIcon={<FaGithub />} onClick={() => signIn()}>
        Supervisor login
      </Button>
    )
  }
  if (allowedEmails?.includes(user as string)) {
    return (
      <Button size="sm" variant="link" leftIcon={<FaGithub />} onClick={() => signOut()}>
        Sign out
      </Button>
    )
  }

  return (
    <AlertDialog isOpen={true} leastDestructiveRef={undefined} onClose={() => null}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            You are not an authorized user
          </AlertDialogHeader>

          <AlertDialogBody>You are not an authorized user, please sign out.</AlertDialogBody>

          <AlertDialogFooter>
            <Button leftIcon={<FaGithub />} colorScheme="gray" onClick={() => signOut()} ml={3}>
              Sign Out
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
