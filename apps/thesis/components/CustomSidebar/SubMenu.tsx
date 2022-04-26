import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Box, Container, HStack, Heading, IconButton, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { usePersistantDisclosure } from '../../hooks/usePersistantDisclosure'
import { RecursiveFolder } from '../../utils/folders'
import { SidebarLink } from './SidebarLink'

export interface SubMenuProps {
  folderName: string
  foldersOrFiles?: RecursiveFolder[]
  defaultIsOpen?: boolean
}
export const SubMenu = (props: SubMenuProps) => {
  const { folderName, foldersOrFiles: files, defaultIsOpen } = props
  const router = useRouter()
  const shouldOpen = !!files?.find(
    (folderOrFile) => folderOrFile.slug && router.asPath.includes(folderOrFile?.slug),
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
      <Container pl={2} mt={4} mb={4}>
        <HStack pl={4} alignItems="center">
          <Heading size="sm" fontWeight="600">
            {folderName}
          </Heading>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Close section"
            icon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
            onClick={onToggle}
          />
        </HStack>
      </Container>
      {isOpen && (
        <VStack pl={2} pr="5%" alignItems="flex-start" spacing={1}>
          {files?.map(({ name, slug, type, children }) => {
            if (type === 'folder') {
              return (
                <SubMenu
                  key={name}
                  folderName={name}
                  foldersOrFiles={children}
                  defaultIsOpen={defaultOpenFolders?.includes(name)}
                />
              )
            }
            return <SidebarLink key={name} {...{ name, slug }} />
          })}
        </VStack>
      )}
    </Box>
  )
}

SubMenu.defaultProps = { foldersOrFiles: [], defaultIsOpen: false }
