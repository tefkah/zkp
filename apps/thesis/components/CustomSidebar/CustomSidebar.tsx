import { Text, VStack, HStack, IconButton, useColorModeValue } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { useMemo } from 'react'
import { FileList } from '../../types'
import { usePersistantDisclosure } from '../../hooks/usePersistantDisclosure'

import { Collapse } from './Collapse'

import { SubMenu } from './SubMenu'
import { SidebarLink } from './SidebarLink'

import { fileListReducer } from '../../utils/folders'

interface Props {
  fileList: FileList
}

export const CustomSideBar = (props: Props) => {
  const { fileList } = props
  const { isOpen, onOpen, onClose, onToggle } = usePersistantDisclosure('showSidebar', {
    defaultIsOpen: true,
  })
  console.log({ fileList })
  const unemph = useColorModeValue('gray.700', 'gray.300')
  const folderList = useMemo(() => fileListReducer(Object.values(fileList)), [fileList])

  const defaultOpenFolders = process.env.DEFAULT_OPEN_SIDEBAR_FOLDERS

  return (
    <>
      {!isOpen && (
        <IconButton
          left={3}
          top={14}
          zIndex={2}
          position="fixed"
          variant="ghost"
          icon={<HamburgerIcon />}
          aria-label="open sidebar"
          onClick={onToggle}
        />
      )}
      <Collapse
        animateOpacity={false}
        dimension="width"
        in={isOpen}
        endingSize={350}
        style={{
          flex: '0 0 auto',
          height: '100vh',
          position: 'sticky',
          top: 0,
          borderRightWidth: 1,
        }}
      >
        <VStack
          zIndex={{ base: 1, md: 0 }}
          pl={1}
          backgroundColor="back"
          alignItems="flex-start"
          overflowX="hidden"
          overflowY="scroll"
          w={{ base: '100vw', md: '100%' }}
          h="100vh"
        >
          <HStack
            backgroundColor="back"
            pl={4}
            w="full"
            alignItems="center"
            pos="sticky"
            pt={3}
            top={0}
            zIndex={2}
          >
            <IconButton
              aria-label="close sidebar"
              icon={<HamburgerIcon />}
              onClick={onClose}
              variant="ghost"
              color={unemph}
            />

            <Text color={unemph}>Files</Text>
          </HStack>
          <VStack alignItems="flex-start">
            {folderList?.children?.map((folderOrFile) => {
              if (folderOrFile.type === 'folder') {
                return (
                  <SubMenu
                    folderName={folderOrFile.name}
                    foldersOrFiles={folderOrFile.children}
                    defaultIsOpen={defaultOpenFolders?.includes(folderOrFile.name)}
                  />
                )
              }
              return (
                <SidebarLink
                  name={folderOrFile.name}
                  slug={folderOrFile.slug}
                  key={folderOrFile.name}
                />
              )
            })}
          </VStack>
        </VStack>
      </Collapse>
    </>
  )
}
