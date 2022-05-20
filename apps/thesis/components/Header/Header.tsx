import React from 'react'
import {
  chakra,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  CloseButton,
  VStack,
  Button,
} from '@chakra-ui/react'
import { useViewportScroll } from 'framer-motion'
import { FaMoon, FaSun } from 'react-icons/fa'
import { AiFillGithub, AiOutlineMenu, AiFillHome, AiOutlineInbox } from 'react-icons/ai'
import { BsFillCameraVideoFill } from 'react-icons/bs'
import { HiAcademicCap } from 'react-icons/hi'
import { useSession } from 'next-auth/react'
import { HeaderLink } from './HeaderLink'

export interface MobileNavProps {
  onClose: any
  isOpen: any
  bg: string
}

export const MobileNavContent = (props: MobileNavProps) => {
  const { onClose, isOpen, bg } = props
  return (
    <VStack
      pos="absolute"
      top={0}
      left={0}
      right={0}
      display={isOpen ? 'flex' : 'none'}
      flexDirection="column"
      p={2}
      pb={4}
      m={2}
      bg={bg}
      spacing={3}
      rounded="sm"
      shadow="sm"
    >
      <CloseButton aria-label="Close menu" justifySelf="self-start" onClick={onClose} />
      <Button w="full" variant="ghost" leftIcon={<AiFillHome />}>
        Dashboard
      </Button>
      <Button w="full" variant="solid" colorScheme="brand" leftIcon={<AiOutlineInbox />}>
        Inbox
      </Button>
      <Button w="full" variant="ghost" leftIcon={<BsFillCameraVideoFill />}>
        Videos
      </Button>
    </VStack>
  )
}
export const Header = () => {
  const mobileNav = useDisclosure()

  const { data: session } = useSession()
  const { toggleColorMode: toggleMode } = useColorMode()
  const text = useColorModeValue('dark', 'light')
  const SwitchIcon = useColorModeValue(FaMoon, FaSun)

  const bg = 'foreground'
  const ref = React.useRef<any>()
  const [y, setY] = React.useState(0)
  const { height = 0 } = ref.current ? ref.current.getBoundingClientRect() : {}

  const { scrollY } = useViewportScroll()
  React.useEffect(() => scrollY.onChange(() => setY(scrollY.get())), [scrollY])

  const user = session

  return (
    <chakra.header
      zIndex={1}
      ref={ref}
      pos="sticky"
      top={0}
      shadow={y > height ? 'sm' : undefined}
      transition="box-shadow 0.2s"
      bgColor="foreground"
      overflowY="hidden"
      borderBottomWidth={1}
    >
      <chakra.div h="3rem" mx="auto">
        <HStack h="full" mx={6} align="center" justify="space-between">
          <HStack spacing={1}>
            <Link href="/">
              <Icon
                as={HiAcademicCap}
                display="block"
                transition="color 0.2s"
                w="5"
                h="5"
                _hover={{ color: 'gray.600' }}
              />
            </Link>
            <HStack spacing={1} px={4}>
              <HeaderLink href="/iii.-anyons">Thesis</HeaderLink>
              <HeaderLink href="/topological-space">Notes</HeaderLink>
              <HeaderLink href="/activity">Activity</HeaderLink>
              {user && (
                <HeaderLink href="/discussions" dontFetch>
                  Discussions
                </HeaderLink>
              )}
            </HStack>
          </HStack>

          <Flex justify="flex-end" maxW="824px" align="center" color="gray.400">
            <HStack spacing="5" display={{ base: 'none', md: 'flex' }}>
              <Link
                isExternal
                aria-label="Go to this website's GitHub page"
                href="https://github.com/ThomasFKJorna/thesis-visualization"
              >
                <Icon
                  as={AiFillGithub}
                  display="block"
                  transition="color 0.2s"
                  w="5"
                  h="5"
                  _hover={{ color: 'gray.600' }}
                />
              </Link>
            </HStack>
            <IconButton
              size="md"
              fontSize="lg"
              aria-label={`Switch to ${text} mode`}
              variant="ghost"
              color="current"
              ml={{ base: '0', md: '3' }}
              onClick={toggleMode}
              icon={<SwitchIcon />}
            />
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              aria-label="Open menu"
              fontSize="20px"
              color={useColorModeValue('dark.secondary', 'inherit')}
              variant="ghost"
              icon={<AiOutlineMenu />}
              onClick={mobileNav.onOpen}
            />
          </Flex>
        </HStack>
        <MobileNavContent isOpen={mobileNav.isOpen} onClose={mobileNav.onClose} bg={bg} />
      </chakra.div>
    </chakra.header>
  )
}
