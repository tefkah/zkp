import { IconButton, useColorModeValue } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { useMemo } from 'react'
import useLocalStorageState from 'use-local-storage-state'
import { DataBy, Sorts } from '@zkp/types'
import { usePersistantDisclosure } from '../../hooks/usePersistantDisclosure'

import { Collapse } from './Collapse'

import { SubMenu } from './SubMenu'
import { SidebarLink } from './SidebarLink'

import { fileListReducer } from '../../utils/folders'
import { sorts } from '../../utils/folders/sorts'
import { SortButton } from './SortButton'

interface Props {
  fileList: DataBy
}

export const CustomSideBar = (props: Props) => {
  const { fileList } = props
  const { isOpen, onClose, onToggle } = usePersistantDisclosure('showSidebar', {
    defaultIsOpen: true,
  })
  const unemph = useColorModeValue('gray.700', 'gray.300')

  const [sort, setSort] = useLocalStorageState<Sorts>('sidebarSort', { defaultValue: 'alpha' })

  const folderList = useMemo(
    () => fileListReducer(Object.values(fileList), sorts[sort]),
    [fileList, sort],
  )

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
        <div
          // zIndex={{ base: 1, md: 1 }}
          // pl={1}
          // backgroundColor="back"
          // alignItems="flex-start"
          // overflowX="hidden"
          // overflowY="scroll"
          // w={{ base: '100vw', md: '100%' }}
          // h="100vh"
          className="z-1 item-start flex h-[100vh] w-[100vw] flex-col items-start gap-2 overflow-scroll bg-slate-50 pl-1 dark:bg-slate-800 md:w-96"
        >
          <div
            // backgroundColor="back"
            // pl={4}
            // w="full"
            // alignItems="center"
            // pos="sticky"
            // pt={3}
            // top={0}
            // zIndex={2}
            className="sticky top-0 z-10 flex w-full items-center gap-2 bg-inherit pl-4 pt-3"
          >
            <IconButton
              aria-label="close sidebar"
              icon={<HamburgerIcon />}
              onClick={onClose}
              variant="ghost"
              color={unemph}
            />

            <p className="text-slate-300 dark:text-slate-700">Files</p>
            <SortButton {...{ sort, setSort, values: ['alpha', 'reverseAlpha'] }}>Aa</SortButton>
            <SortButton {...{ sort, setSort, values: ['created', 'reverseCreated'] }}>
              Created
            </SortButton>
            <SortButton {...{ sort, setSort, values: ['modified', 'reverseModified'] }}>
              Modified
            </SortButton>
          </div>
          <div className="flex flex-col items-start gap-2 pl-4">
            {folderList?.children?.map((folderOrFile) => {
              if (folderOrFile.type === 'folder') {
                return (
                  <SubMenu
                    key={folderOrFile.name}
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
          </div>
        </div>
      </Collapse>
    </>
  )
}
