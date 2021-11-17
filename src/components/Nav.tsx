import React, { ReactNode } from 'react'
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  IconButton,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'#'}
  >
    {children}
  </Link>
)

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box>Logo</Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>

              <IconButton aria-label="Link to Github" icon={<FaGithub />}>
                <Link isExternal href="https://github.com/ThomasFKJorna/thesis-visualization" />
              </IconButton>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Avatar
                    size={'sm'}
                    src={'https://avatars.githubusercontent.com/u/21983833?v=4'}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar
                      size={'2xl'}
                      src={'https://avatars.githubusercontent.com/u/21983833?v=4'}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>Hi! 👋 I'm Thomas</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem icon={<FaGithub />}>Follow me on GitHub</MenuItem>
                  <MenuItem icon={<FaTwitter />}>Twitter me </MenuItem>
                  <MenuItem icon={<FaLinkedin />}>LinkedIn</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}
