import {
  Text,
  Flex,
  VStack,
  CloseButton,
  HStack,
  Heading,
  Box,
  Container,
  Icon,
  useDisclosure,
  IconButton,
  useColorModeValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Slide,
  transition,
} from '@chakra-ui/react'
import { Collapse } from './Collapse'
import React, { useState } from 'react'
import { Resizable } from 're-resizable'
import Link from 'next/link'
import { File, Files } from '../../types/notes'
import { slugify } from '../../utils/slug'
import { BsFileEarmarkText } from 'react-icons/bs'
import { ChevronDownIcon, ChevronRightIcon, HamburgerIcon } from '@chakra-ui/icons'
import { usePersistantState } from '../../hooks/usePersistantState'
import { usePersistantDisclosure } from '../../hooks/usePersistantDisclosure'
import { useRouter } from 'next/router'

import shallow from 'zustand/shallow'
import { useNotes } from '../../stores/noteStore'
import { SidebarLink } from './SidebarLink'
interface Props {
  items: Files
}

export const CustomSideBar = (props: Props) => {
  const { items } = props
  const { isOpen, onOpen, onClose, onToggle } = usePersistantDisclosure('showSidebar', {
    defaultIsOpen: true,
  })
  const unemph = useColorModeValue('gray.700', 'gray.300')
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
        // startingSize={0}
        //  unmountOnExit
      >
        <VStack
          zIndex={{ base: 1, md: 0 }}
          pl={1}
          backgroundColor="back"
          // pt="1%"
          alignItems="flex-start"
          overflowX="hidden"
          overflowY="scroll"
          w={{ base: '100vw', md: '100%' }}
          h="100vh"
          //  position="fixed"
        >
          <HStack
            backgroundColor="back" // w="full"
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
            {Object.entries(items.folders)
              .reverse()
              .map(([folder, files]) => (
                <SubMenu {...{ folder, files }} defaultIsOpen={['Chapters']?.includes(folder)} />
              ))}
            <SubMenu folder="Notes" files={items.files} defaultIsOpen />
          </VStack>
        </VStack>
      </Collapse>
    </>
  )
}

export interface SubMenuProps {
  folder: string
  files: File[]
  defaultIsOpen?: boolean
}
export const SubMenu = (props: SubMenuProps) => {
  const { folder, files, defaultIsOpen } = props
  const router = useRouter()
  const fileList = files.map((file) => `/${slugify(file.path)}`)
  const shouldOpen = fileList?.includes(router.asPath)

  //  const [rando, setRando] = usePersistantState('h', true)
  const { onToggle, isOpen } = usePersistantDisclosure(folder, {
    defaultIsOpen: shouldOpen || (defaultIsOpen && true),
  })
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const currentColor = 'primary' // useColorModeValue('black', 'white')

  const [setHighlightedNote, unHighlightNotes] = useNotes(
    (state) => [state.setHighlightedNote, state.unHighlightNotes],
    shallow,
  )

  return (
    <Box key={folder}>
      <Container pl={2} mt={4} mb={4}>
        <HStack pl={4} alignItems="center">
          <Heading size="sm" fontWeight="600">
            {folder}
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
          {files.map((item: File, index: number) => (
            <SidebarLink
              {...{ currentColor, textColor }}
              item={item}
              path={router.asPath}
              key={`${item.path}${index}`}
            />
          ))}
        </VStack>
      )}
    </Box>
  )
}
