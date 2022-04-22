import shallow from 'zustand/shallow'
import {
  Flex,
  Tag,
  Text,
  HStack,
  VStack,
  Container,
  Heading,
  CSSObject,
  useColorMode,
  Box,
} from '@chakra-ui/react'
import { useElementSize } from '@mantine/hooks'
import { title } from 'process'
import React, { useMemo } from 'react'
import { CommitPerDateLog, CSLCitation } from '../../lib/api'
import { Files, NoteHeading as NoteHeading } from '../../pages/[...file]'
import { OrgFileData } from '../../utils/IDIndex/getDataFromFile'
import { FilesData } from '../../utils/IDIndex/getFilesData'
import { parseTime } from '../../utils/parseTime'
import { CommentBox } from '../Comments/CommentBox'
import { OutlineBox } from '../OutlineBox/OutlineBox'
import { ProcessedOrg } from '../ProcessedOrg'
import { Backlinks } from './Backlinks'
import { Citations } from './Citations'
import { StackState } from './NoteScrollContainer'
import { useNotes } from '../../stores/noteStore'

export interface NoteProps {
  stackedNotes: string[]
  page: string
  fileData: OrgFileData
  data: FilesData
  slug: string
  toc: NoteHeading[]
  commits: CommitPerDateLog
  csl: CSLCitation[]
  stackData?: StackState
  index: number
  // ref?: any
}

export const BaseNote = React.forwardRef((props: NoteProps, ref: any) => {
  const { index, stackData, toc, stackedNotes, fileData, page, data, slug, commits, csl } = props
  const { title, tags, ctime, mtime, backLinks, citations, citation } = fileData

  const stacked = stackedNotes.length > 1
  const [obstructedOffset, obstructedPageWidth, noteWidth] = useNotes(
    (state) => [state.obstructedOffset, state.obstructedPageWidth, state.noteWidth],
    shallow,
  )
  const { colorMode } = useColorMode()
  // const { ref, width, height } = useElementSize()

  const stackedNoteStyle: CSSObject = stacked
    ? {
        borderStyle: 'solid',
        borderLeftWidth: '1px',
        flexShrink: '0',
        maxHeight: '95vh',
        w: '75ch',
      }
    : {}

  const highlightedStyle: CSSObject = stackData?.highlighted
    ? {
        backgroundColor: 'brand.100',
      }
    : {}
  const overlayStyle: CSSObject = stackData?.overlay
    ? {
        boxShadow: '2xl',
      }
    : {}
  const obstructedStyle: CSSObject = stackData?.obstructed ? {} : {}

  const Note = useMemo(() => {
    return (
      <Container w="75ch" my={8}>
        <Heading size="lg" mb={4}>
          {slug}
        </Heading>
        <HStack my={2} spacing={2}>
          {!tags?.includes('chapter') &&
            tags?.map((tag: string) => (
              <Tag key={tag} size="sm" variant="outline">
                {tag}
              </Tag>
            ))}
        </HStack>
        <VStack mb={4} spacing={0.5} alignItems="flex-start">
          {ctime && (
            <Text fontSize={12} color="gray.500">
              Created on{' '}
              <Text fontWeight={500} as="span" color="gray.600">
                {parseTime(ctime)}
              </Text>
            </Text>
          )}
          {mtime && (
            <Text fontSize={12} color="gray.500">
              Last modified{' '}
              <Text as="span" fontWeight={500} color="gray.600">
                {' '}
                {parseTime(mtime)}
              </Text>
            </Text>
          )}
        </VStack>
        <ProcessedOrg currentId={fileData.id} text={page} data={data} />
        {backLinks?.length && <Backlinks {...{ currentId: fileData.id, data, backLinks }} />}
        {citations?.length && <Citations {...{ csl }} />}

        {!stacked && <CommentBox {...{ title }} />}
      </Container>
    )
  }, [stacked, citations, backLinks, ctime, mtime, page, data, fileData, slug, tags])

  return (
    <Flex
      w="75ch"
      ref={ref}
      sx={{
        padding: 4,
        backgroundColor: colorMode === 'dark' ? 'dark.primary' : 'white',
        left: `${obstructedPageWidth * (index || 0)}px`,
        right: `${-noteWidth + (obstructedPageWidth * (stackedNotes.length - index) || 0)}`,
        transition:
          'box-shadow 100ms linear, opacity 75ms linear, transform 200ms cubic-bezier(0.19, 1, 0.22, 1), background-color 0.3s ease',
        maxH: '95vh',
        position: 'sticky',
        flexGrow: 1,
        overflowY: 'scroll',
        scrollBehavior: 'smooth',
        ...stackedNoteStyle,
        ...overlayStyle,
        ...obstructedStyle,
        ...highlightedStyle,
      }}
      justifyContent={stacked ? 'flex-start' : 'space-between'}
    >
      {stacked && (
        <Heading
          size="md"
          sx={{
            textDecoration: 'none',
            fontSize: '17px',
            lineHeight: `${obstructedPageWidth}px`,
            fontWeight: '500',
            marginTop: 14,
            top: '0px',
            bottom: '0px',
            left: '0px',
            position: 'absolute',
            backgroundColor: 'transparent',
            width: `${obstructedPageWidth}px`,
            writingMode: 'vertical-lr',
            textOrientation: 'sideways',
            overflow: 'hidden',
            opacity: stackData?.obstructed ? 1 : 0,
            transition: 'color 0.3s ease, opacity 0.1s ease',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {fileData.title}
        </Heading>
      )}
      <Box
        flexGrow={1}
        sx={{
          transition: 'opacity 0.2s ease',
          opacity: stackData?.obstructed ? 0 : undefined,
        }}
      >
        {Note}
      </Box>
      {!stacked && <OutlineBox {...{ headings: toc, commits }} />}
    </Flex>
  )
})
