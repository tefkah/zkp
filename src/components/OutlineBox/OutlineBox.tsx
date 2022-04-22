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
import { Commit, CommitPerDateLog } from '../../lib/api'
import { NoteHeading } from '../../pages/[...file]'
import { CommitList } from '../Commits/CommitList'
import TableOfContent from './TableOfContents'
import { ItemPanel } from './ItemPanel'

interface Props {
  commits: CommitPerDateLog
  headings: NoteHeading[]
}

export const OutlineBox = (props: Props) => {
  const { commits, headings, ...rest } = props
  return (
    <Box
      as="nav"
      aria-labelledby="toc-title"
      width={60}
      flexShrink={0}
      display={{ base: 'none', md: 'block' }}
      position="sticky"
      pr="4"
      top="2rem"
      right="0"
      fontSize="sm"
      alignSelf="start"
    >
      <Tabs isFitted size="sm" variant="unstyled" colorScheme="red" align="end">
        <TabList>
          <Tab
            _selected={{ borderBottomWidth: 1, borderBottomColor: 'primary' }}
            _focus={{ borderBottomWidth: 1, borderBottomColor: 'primary' }}
          >
            <Text fontWeight="500">TOC</Text>
          </Tab>
          <Tab
            _focus={{ borderBottomWidth: 1, borderBottomColor: 'primary' }}
            _selected={{ borderBottomWidth: 1, borderBottomColor: 'primary' }}
          >
            <Text fontWeight="500">History</Text>
          </Tab>
          <Tab
            _focus={{ borderBottomWidth: 1, borderBottomColor: 'primary' }}
            _selected={{ borderBottomWidth: 1, borderBottomColor: 'primary' }}
          >
            <Text fontWeight="500">Info</Text>
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
