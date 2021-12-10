import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React from 'react'
import { Commit, CommitPerDateLog } from '../../api'
import { Heading } from '../../pages/[...file]'
import { CommitList } from '../Commits/CommitList'
import TableOfContent from '../TableOfContents'

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
      width="16rem"
      flexShrink={0}
      display={{ base: 'none', xl: 'block' }}
      position="sticky"
      py="6"
      pr="4"
      top="3rem"
      right="0"
      fontSize="sm"
      alignSelf="start"
      {...rest}
    >
      <Tabs size="md" variant="unstyled" colorScheme="red" align="end">
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
        </TabList>
        <TabPanels
          maxHeight="calc(100vh - 3rem)"
          overflowY="auto"
          sx={{ overscrollBehavior: 'contain' }}
        >
          <TabPanel>
            <TableOfContent {...{ headings }} />
          </TabPanel>
          <TabPanel>
            <CommitList slim commitLog={commits} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
