import React from 'react'
// import { FaMoon, FaSun } from 'react-icons/fa'
import { AiFillGithub } from 'react-icons/ai'
import { HiAcademicCap } from 'react-icons/hi'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { HeaderLink } from './HeaderLink'

export const Header = () => {
  // const mobileNav = useDisclosure()

  const { data: session } = useSession()
  // const { toggleColorMode: toggleMode } = useColorMode()
  // const SwitchIcon = useColorModeValue(FaMoon, FaSun)

  // const ref = React.useRef<any>()
  // const [y, setY] = React.useState(0)
  // const { height = 0 } = ref.current ? ref.current.getBoundingClientRect() : {}

  // const { scrollY } = useViewportScroll()
  // React.useEffect(() => scrollY.onChange(() => setY(scrollY.get())), [scrollY])

  const user = session

  return (
    <header
      className="sticky top-0 z-10 overflow-y-hidden bg-white transition-shadow"
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
            <Link href="/" passHref>
              <span className="block h-5 w-5 transition-colors hover:text-slate-600">
                <HiAcademicCap />
              </span>
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
              <a
                aria-label="Go to this website's GitHub page"
                href="https://github.com/ThomasFKJorna/thesis-visualization"
              >
                <span className="block h-5 w-5 transition-colors hover:text-slate-600">
                  <AiFillGithub />
                </span>
              </a>
            </div>
            {/* <IconButton
              size="md"
              fontSize="lg"
              aria-label="Switch to dark/light mode"
              variant="ghost"
              color="current"
              ml={{ base: '0', md: '3' }}
              onClick={toggleMode}
              icon={<SwitchIcon />}
            /> */}
            {/* <IconButton
              display={{ base: 'flex', md: 'none' }}
              aria-label="Open menu"
              fontSize="20px"
              color={useColorModeValue('dark.secondary', 'inherit')}
              variant="ghost"
              icon={<AiOutlineMenu />}
            /> */}
          </div>
        </div>
      </div>
    </header>
  )
}
