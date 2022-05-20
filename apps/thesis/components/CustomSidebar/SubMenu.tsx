import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Box, Container, HStack, Heading, VStack, Collapse, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { usePersistantDisclosure } from '../../hooks/usePersistantDisclosure'
import { FileLeaf, isFolder, RecursiveFolder } from '../../types'
import { SidebarLink } from './SidebarLink'

export interface SubMenuProps {
  folderName: string
  foldersOrFiles?: (FileLeaf | RecursiveFolder)[]
  defaultIsOpen?: boolean
}
export const SubMenu = (props: SubMenuProps) => {
  const { folderName, foldersOrFiles: files, defaultIsOpen } = props
  const router = useRouter()
  const shouldOpen = !!files?.find(
    (folderOrFile): boolean => !!folderOrFile.slug && router.asPath.includes(folderOrFile?.slug),
  )

  //  const [rando, setRando] = usePersistantState('h', true)
  const { onToggle, isOpen } = usePersistantDisclosure(folderName, {
    defaultIsOpen: shouldOpen || (defaultIsOpen && true),
  })

  const defaultOpenFolders = process.env.DEFAULT_OPEN_SIDEBAR_FOLDERS
  //  const textColor = useColorModeValue('gray.600', 'gray.400')
  //  const currentColor = 'primary' // useColorModeValue('black', 'white')

  return (
    <Box key={folderName}>
      <Container mt={4} mb={4}>
        <HStack alignItems="center">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Close section"
            rightIcon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
            onClick={onToggle}
          >
            <Heading size="sm" fontWeight="600">
              {folderName}
            </Heading>
          </Button>
        </HStack>
      </Container>

      <Collapse in={isOpen} animateOpacity={false}>
        <VStack pl={4} py={2} pb={3} pr="5%" alignItems="flex-start" spacing={1}>
          {files?.map((fileOrFolder) => {
            const { name, slug } = fileOrFolder
            if (isFolder(fileOrFolder)) {
              return (
                <SubMenu
                  key={name}
                  folderName={name}
                  foldersOrFiles={fileOrFolder.children}
                  defaultIsOpen={defaultOpenFolders?.includes(name)}
                />
              )
            }
            return <SidebarLink key={name} {...{ name, slug }} />
          })}
        </VStack>
      </Collapse>
    </Box>
  )
}

SubMenu.defaultProps = { foldersOrFiles: [], defaultIsOpen: false }
