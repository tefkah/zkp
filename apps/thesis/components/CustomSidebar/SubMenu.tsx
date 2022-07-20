// import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { FileLeaf, isFolder, RecursiveFolder } from '@zkp/types'
import { Disclosure } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { TriangleRightIcon } from '@primer/octicons-react'
import { SidebarLink } from './SidebarLink'

export interface SubMenuProps {
  folderName: string
  foldersOrFiles?: (FileLeaf | RecursiveFolder)[]
  defaultIsOpen?: boolean
}
export const SubMenu = (props: SubMenuProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { folderName, foldersOrFiles: files, defaultIsOpen } = props
  //  const router = useRouter()
  // const shouldOpen = !!files?.find(
  //   (folderOrFile): boolean => !!folderOrFile.slug && router.asPath.includes(folderOrFile?.slug),
  // )

  //  const [rando, setRando] = usePersistantState('h', true)
  // const { onToggle, isOpen } = useDisclosure()
  // usePersistantDisclosure(folderName, {
  //   defaultIsOpen: shouldOpen || (defaultIsOpen && true),
  // })

  const defaultOpenFolders = process.env.DEFAULT_OPEN_SIDEBAR_FOLDERS
  //  const textColor = useColorModeValue('gray.600', 'gray.400')
  //  const currentColor = 'primary' // useColorModeValue('black', 'white')

  return (
    <div key={folderName} className="w-full">
      {/* <Container mt={4} mb={4}>
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

      <Collapse in={isOpen} animateOpacity={false}> */}
      <Disclosure>
        {({ open }: { open: boolean }) => (
          <>
            <Disclosure.Button
              // as={Button}
              className="gap-2 bg-transparent px-1 text-slate-800 hover:bg-slate-100 dark:text-slate-200"
            >
              <TriangleRightIcon
                className={`text-slate-600 transition-transform ${open ? 'rotate-90' : ''}`}
              />
              {folderName}
            </Disclosure.Button>
            {/* <Transition
          appear
          enter="transition-all duration-500 ease-out"
          enterFrom="h-0"
          enterTo="h-full"
          leave="transition-all duration-500 ease-out"
          leaveFrom="h-full"
          leaveTo="h-0"
        > */}
            <AnimatePresence>
              {open && (
                <Disclosure.Panel
                  static
                  as={motion.div}
                  initial={{ height: 0 }}
                  animate={{
                    height: 'min-content',
                  }}
                  transition={{ duration: 0.3 }}
                  exit={{ height: 0 }}
                  className="w-full overflow-clip"
                >
                  <div
                    // pl={4}
                    // py={2}
                    // pb={3}
                    // pr="5%"
                    // alignItems="flex-start"
                    // spacing={1}
                    className="flex w-full flex-col items-start gap-1 py-2 pl-2 pb-3 pr-[5%]"
                  >
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
                  </div>
                </Disclosure.Panel>
              )}
            </AnimatePresence>
          </>
        )}
        {/* </Transition> */}
      </Disclosure>
      {/* </Collapse> */}
    </div>
  )
}

SubMenu.defaultProps = { foldersOrFiles: [], defaultIsOpen: false }
