import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { CommitPerDateLog, NoteHeading } from '@zkp/types'
import { CommitList } from '../Commits/CommitList'
import { TableOfContent } from './TableOfContents'
import { ItemPanel } from './ItemPanel'

interface Props {
  commits: CommitPerDateLog
  headings: NoteHeading[]
}

export const OutlineBox = (props: Props) => {
  const { commits, headings } = props
  return (
    <nav
      // as="nav"
      className="md:display:block sm:display:none sticky top-8 right-0 w-60 flex-shrink-0 self-start pr-4 text-sm"
      aria-labelledby="toc-title"
      // display={{ base: 'none', md: 'block' }}
    >
      <Tabs isFitted size="sm" variant="unstyled" colorScheme="red" align="end">
        <TabList>
          <Tab
            _selected={{ borderBottomWidth: 1, borderBottomColor: 'primary' }}
            _focus={{ borderBottomWidth: 1, borderBottomColor: 'primary' }}
          >
            <p className="font-medium">TOC</p>
          </Tab>
          <Tab
            _focus={{ borderBottomWidth: 1, borderBottomColor: 'primary' }}
            _selected={{ borderBottomWidth: 1, borderBottomColor: 'primary' }}
          >
            <p className="font-medium">History</p>
          </Tab>
          <Tab
            _focus={{ borderBottomWidth: 1, borderBottomColor: 'primary' }}
            _selected={{ borderBottomWidth: 1, borderBottomColor: 'primary' }}
          >
            <p className="font-medium">Info</p>
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
            <ItemPanel title="" pdfLocation="" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </nav>
  )
}
