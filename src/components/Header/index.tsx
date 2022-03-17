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
  Box,
  VStack,
  Button,
} from '@chakra-ui/react'
import { useViewportScroll } from 'framer-motion'
import { FaMoon, FaSun, FaHeart } from 'react-icons/fa'
import { AiFillGithub, AiOutlineMenu, AiFillHome, AiOutlineInbox } from 'react-icons/ai'
import { BsFillCameraVideoFill } from 'react-icons/bs'
import { HiAcademicCap } from 'react-icons/hi'
import { VscCircleOutline } from 'react-icons/vsc'
import { HeaderLink } from './HeaderLink'
import { useSession } from 'next-auth/react'

export interface HeaderProps {}
const ChakraUIHeader = (props: HeaderProps) => {
  const mobileNav = useDisclosure()

  const { data: session } = useSession()
  const { toggleColorMode: toggleMode } = useColorMode()
  const text = useColorModeValue('dark', 'light')
  const SwitchIcon = useColorModeValue(FaMoon, FaSun)

  const bg = useColorModeValue('white', 'gray.800')
  const ref = React.useRef<any>()
  const [y, setY] = React.useState(0)
  const { height = 0 } = ref.current ? ref.current.getBoundingClientRect() : {}

  const { scrollY } = useViewportScroll()
  React.useEffect(() => {
    return scrollY.onChange(() => setY(scrollY.get()))
  }, [scrollY])

  const user = session

  const SponsorButton = (
    <Box
      display={{ base: 'none', md: 'flex' }}
      alignItems="center"
      as="a"
      aria-label="Sponsor Choc UI on Open Collective"
      href={''}
      target="_blank"
      rel="noopener noreferrer"
      bg="gray.50"
      borderWidth="1px"
      borderColor="gray.200"
      px="1em"
      minH="36px"
      rounded="md"
      fontSize="sm"
      color="gray.800"
      outline="0"
      transition="all 0.3s"
      _hover={{
        bg: 'gray.100',
        borderColor: 'gray.300',
      }}
      _active={{
        borderColor: 'gray.200',
      }}
      _focus={{
        boxShadow: 'outline',
      }}
      ml={5}
    >
      <Icon as={FaHeart} w="4" h="4" color="primary" mr="2" />
      <Box as="strong" lineHeight="inherit" fontWeight="semibold">
        Sponsor
      </Box>
    </Box>
  )
  return (
    <chakra.header
      zIndex={1}
      ref={ref}
      pos="sticky"
      top={0}
      shadow={y > height ? 'sm' : undefined}
      transition="box-shadow 0.2s"
      bg={bg}
      //borderTop="6px solid"
      //borderTopColor="brand.400"
      //w="full"
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
              <HeaderLink href="/III.-Anyons">Thesis</HeaderLink>
              <HeaderLink href="/Topological-space">Notes</HeaderLink>
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
              color={useColorModeValue('gray.800', 'inherit')}
              variant="ghost"
              icon={<AiOutlineMenu />}
              onClick={mobileNav.onOpen}
            />
          </Flex>
        </HStack>
        {<MobileNavContent isOpen={mobileNav.isOpen} onClose={mobileNav.onClose} bg={bg} />}
      </chakra.div>
    </chakra.header>
  )
}

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
export default ChakraUIHeader
