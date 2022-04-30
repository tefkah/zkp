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
import React, { useMemo } from 'react'
import { NoteHeading, CommitPerDateLog, CSLCitation, StackState } from '../../types'
import { OrgFileData } from '../../utils/IDIndex/getDataFromFile'
import { FilesData } from '../../utils/IDIndex/getFilesData'
import { parseTime } from '../../utils/parseTime'
import { CommentBox } from '../Comments/CommentBox'
import { OutlineBox } from '../OutlineBox/OutlineBox'
import { ProcessedOrg } from '../ProcessedOrg'
import { Backlinks } from './Backlinks'
import { Citations } from './Citations'
import { useNotes } from '../../stores/noteStore'
import { MDXNote } from './MDXNote'
import { FilePageProps } from '../../pages/[file]'

export interface NoteProps extends FilePageProps {
  // stackData?: StackState
  index: number
  // ref?: any
}

export const BaseNote = React.forwardRef((props: NoteProps, ref: any) => {
  const { index, toc, stackedNotes, source, id, commits } = props
  // const { title, tags, ctime, mtime, backLinks, citations } = fileData

  const stacked = (stackedNotes?.length ?? 0) > 1
  const { obstructedPageWidth, noteWidth, getStackStateById } = useNotes(
    (state) => ({
      obstructedPageWidth: state.obstructedPageWidth,
      noteWidth: state.noteWidth,
      getStackStateById: state.getStackStateById,
    }),
    shallow,
  )
  const { colorMode } = useColorMode()
  // const { ref, width, height } = useElementSize()
  const stackData = getStackStateById(id)
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

  const Note = useMemo(
    () => (
      <Container w="75ch" minHeight="full" my={8}>
        {/*         <Heading size="lg" mb={4}>
          {id}
        </Heading> */}
        {/*         <HStack my={2} spacing={2}>
          {!tags?.includes('chapter') &&
            tags?.map((tag: string) => (
              <Tag key={tag} size="sm" variant="outline">
                {tag}
              </Tag>
            ))}
        </HStack> */}
        {/*         <VStack mb={4} spacing={0.5} alignItems="flex-start">
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
        </VStack> */}
        <MDXNote source={source} currentId={id} />
        {/* backLinks?.length && <Backlinks {...{ currentId: id, backLinks }} /> */}

        {/* !stacked && <CommentBox {...{ title }} /> */}
      </Container>
    ),
    [stacked, id, source],
  )

  return (
    <Flex
      w="75ch"
      ref={ref}
      sx={{
        padding: 4,
        backgroundColor: colorMode === 'dark' ? 'dark.primary' : 'white',
        left: `${obstructedPageWidth * (index || 0)}px`,
        right: `${-noteWidth + (obstructedPageWidth * ((stackedNotes?.length ?? 0) - index) || 0)}`,
        transition:
          'box-shadow 100ms linear, opacity 75ms linear, transform 200ms cubic-bezier(0.19, 1, 0.22, 1), background-color 0.3s ease',
        maxH: '95vh',
        minH: 'full',
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
          // TODO: do not inline all the stacked note styles
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
          {id}
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

BaseNote.displayName = 'BaseNote'
