import {
  Box,
  Button,
  Heading as ChakraHeading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  Text,
  Center,
  HStack,
} from '@chakra-ui/react'
import React from 'react'
import { AiFillFilePdf } from 'react-icons/ai'
import { FaCreativeCommons, FaCreativeCommonsBy, FaCreativeCommonsSa } from 'react-icons/fa'
import { Commit, CommitPerDateLog } from '../../api'
import { Heading } from '../../pages/[...file]'
import { CommitList } from '../Commits/CommitList'
import TableOfContent from './TableOfContents'
import { ItemPanel } from './ItemPanel'

interface Props {
  commits: CommitPerDateLog
  headings: Heading[]
}

export const OutlineBox = (props: Props) => {
  const { commits, headings, ...rest } = props
  return (
    <Box
      as="nav"
      aria-labelledby="toc-title"
      width={60}
      flexShrink={0}
      display={{ base: 'none', xl: 'block' }}
      position="sticky"
      pr="4"
      top="3rem"
      right="0"
      fontSize="sm"
      alignSelf="start"
      {...rest}
    >
      <Tabs isFitted size="sm" variant="unstyled" colorScheme="red" align="end">
        <TabList>
          <Tab
            _selected={{ borderBottomWidth: 1, borderBottomColor: 'red.500' }}
            _focus={{ borderBottomWidth: 1, borderBottomColor: 'red.500' }}
          >
            TOC
          </Tab>
          <Tab
            _focus={{ borderBottomWidth: 1, borderBottomColor: 'red.500' }}
            _selected={{ borderBottomWidth: 1, borderBottomColor: 'red.500' }}
          >
            History
          </Tab>
          <Tab
            _focus={{ borderBottomWidth: 1, borderBottomColor: 'red.500' }}
            _selected={{ borderBottomWidth: 1, borderBottomColor: 'red.500' }}
          >
            Info
          </Tab>
        </TabList>
        <TabPanels
          maxHeight="calc(100vh - 7rem)"
          overflowY="auto"
          sx={{ overscrollBehavior: 'contain' }}
        >
          <TabPanel>
            <TableOfContent {...{ headings }} />
          </TabPanel>
          <TabPanel>
            <CommitList slim commitLog={commits} />
          </TabPanel>
          <TabPanel>
            <ItemPanel title={''} pdfLocation={''} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
