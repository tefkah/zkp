import {
  Box,
  Container,
  HStack,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import {
  FaCreativeCommons,
  FaCreativeCommonsBy,
  FaCreativeCommonsSa,
  FaGithub,
  FaTwitter,
} from 'react-icons/fa'
import { format } from 'date-fns'
import { SignInButton } from './SignInButton'
import { SocialButton } from './SocialButton'

const CCText =
  'All writing, images, and other material on this website (unless otherwise stated) is licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0 license. This means that you are free to redistribute, share, and remix said material granted that you provide proper attribution AND that you share your remixed work under the same license.'

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
        <Text>© 2021-{format(new Date(), 'yyyy')} Thomas F. K. Jorna</Text>
        <Tooltip label={CCText}>
          <LinkBox as={HStack}>
            <FaCreativeCommons />
            <FaCreativeCommonsBy />{' '}
            <LinkOverlay href="https://creativecommons.org/licenses/by-sa/4.0">
              <FaCreativeCommonsSa />
            </LinkOverlay>
          </LinkBox>
        </Tooltip>
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
