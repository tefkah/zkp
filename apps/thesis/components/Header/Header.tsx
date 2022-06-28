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

export const Header = () => {
  const mobileNav = useDisclosure()

  const { data: session } = useSession()
  const { toggleColorMode: toggleMode } = useColorMode()
  const text = useColorModeValue('dark', 'light')
  const SwitchIcon = useColorModeValue(FaMoon, FaSun)

  // const ref = React.useRef<any>()
  // const [y, setY] = React.useState(0)
  // const { height = 0 } = ref.current ? ref.current.getBoundingClientRect() : {}

  // const { scrollY } = useViewportScroll()
  // React.useEffect(() => scrollY.onChange(() => setY(scrollY.get())), [scrollY])

  const user = session

  return (
    <header
      className="z-1 sticky top-0 overflow-y-hidden bg-white shadow-sm transition-shadow"
      // zIndex={1}
      // ref={ref}
      // pos="sticky"
      // top={0}
      // shadow={y > height ? 'sm' : undefined}
      // transition="box-shadow 0.2s"
      // bgColor="foreground"
      // overflowY="hidden"
      // borderBottomWidth={1}
    >
      <div className="mx-[auto] h-12">
        <div className="mx-6 flex h-full items-center justify-between">
          <div className="flex items-center gap-1">
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
            <div className="flex items-center gap-1 px-4">
              <HeaderLink href="/iii.-anyons">Thesis</HeaderLink>
              <HeaderLink href="/topological-space">Notes</HeaderLink>
              <HeaderLink href="/activity">Activity</HeaderLink>
              {user && <HeaderLink href="/discussions">Discussions</HeaderLink>}
            </div>
          </div>

          <div className="flex max-w-[824px] items-center justify-end text-slate-400">
            <div className="flex hidden items-center gap-5 md:flex">
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
            </div>
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
          </div>
        </div>
      </div>
    </header>
  )
}
