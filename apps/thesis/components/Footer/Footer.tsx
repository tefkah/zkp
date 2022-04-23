import {
  Box,
  chakra,
  Container,
  HStack,
  Link,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
  VStack,
} from '@chakra-ui/react'
import {
  FaCreativeCommons,
  FaCreativeCommonsBy,
  FaCreativeCommonsSa,
  FaGithub,
  FaTwitter,
} from 'react-icons/fa'
import React, { ReactNode } from 'react'
import { SignInButton } from './SignInButton'

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode
  label: string
  href: string
}) => (
  <chakra.button
    bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
    rounded="full"
    w={8}
    h={8}
    cursor="pointer"
    as="a"
    href={href}
    display="inline-flex"
    alignItems="center"
    justifyContent="center"
    transition="background 0.3s ease"
    _hover={{
      bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
    }}
  >
    <VisuallyHidden>{label}</VisuallyHidden>
    {children}
  </chakra.button>
)

export const Footer = () => (
  <Box
    bg="back"
    color={useColorModeValue('gray.700', 'gray.200')}
    h={24}
    w="full"
    borderTopWidth={1}
  >
    <Container
      as={Stack}
      maxW="6xl"
      py={4}
      h="full"
      direction={{ base: 'column', md: 'row' }}
      spacing={4}
      justify={{ base: 'center', md: 'space-between' }}
      align={{ base: 'center', md: 'center' }}
    >
      <VStack
        h="full"
        justifyContent="space-between"
        alignItems={{ base: 'center', md: 'flex-start' }}
      >
        <Text>© 2021 Thomas F. K. Jorna</Text>
        <Link href="https://creativecommons.org/licenses/by-sa/4.0">
          <HStack>
            <FaCreativeCommons />
            <FaCreativeCommonsBy /> <FaCreativeCommonsSa />
          </HStack>
        </Link>
      </VStack>
      <VStack h="full" alignItems="flex-end" justifyContent="space-between">
        <HStack spacing={6}>
          <SocialButton label="Twitter" href="https://twitter.com/BewitchedLang">
            <FaTwitter />
          </SocialButton>
          <SocialButton label="GitHub" href="https://github.com/ThomasFKJorna">
            <FaGithub />
          </SocialButton>
        </HStack>

        <SignInButton />
      </VStack>
    </Container>
  </Box>
)
