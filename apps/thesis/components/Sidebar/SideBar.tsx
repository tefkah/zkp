import React from 'react'
import { Box, useDisclosure, IconButton, SlideFade } from '@chakra-ui/react'
import { MdMenu, MdClose } from 'react-icons/md'
import SidebarContent from './SidebarContent'

const Sidebar = () => {
  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: true })
  const SidebarIcon = isOpen ? MdClose : MdMenu

  return (
    <>
      <Box
        id="sidebar"
        as="nav"
        aria-label="Main Navigation"
        pos="sticky"
        sx={{
          overscrollBehavior: 'contain',
        }}
        top="6.5rem"
        w={isOpen ? '280px' : 0}
        transition="width .2s ease-in-out"
        h="calc(((100vh - 1.5rem) - 64px) );"
        pb="8"
        // mt="20"
        //  overflowY="auto"
        className="sidebar-content"
        flexShrink={0}
        display={{ base: 'none', md: 'block' }}
        shadow="sm"
      >
        <IconButton
          pos="sticky"
          mt={1}
          right={0}
          top={0}
          zIndex={10}
          roundedLeft={0}
          size="md"
          fontSize="lg"
          aria-label="Toggle Sidebar"
          variant="solid"
          colorScheme="gray"
          onClick={onClose}
          icon={<SidebarIcon />}
        />
        <SidebarContent />
      </Box>
      {!isOpen && (
        <Box sx={{ zIndex: 'overlay' }} pos="sticky" top={20} left={0}>
          <IconButton
            roundedLeft={0}
            size="md"
            fontSize="lg"
            aria-label="Toggle Sidebar"
            variant="solid"
            colorScheme="gray"
            onClick={onOpen}
            icon={<SidebarIcon />}
          />
        </Box>
      )}
    </>
  )
}

export default Sidebar
