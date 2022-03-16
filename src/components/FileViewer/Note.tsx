import { Flex, Tag, Text, HStack, VStack, Container, Heading } from '@chakra-ui/react'
import { title } from 'process'
import React from 'react'
import { CommitPerDateLog, CSLCitation } from '../../lib/api'
import { Files, Heading as NoteHeading } from '../../pages/[...file]'
import { OrgFileData } from '../../utils/IDIndex/getDataFromFile'
import { FilesData } from '../../utils/IDIndex/getFilesData'
import { parseTime } from '../../utils/parseTime'
import { CommentBox } from '../Comments/CommentBox'
import { OutlineBox } from '../OutlineBox/OutlineBox'
import { ProcessedOrg } from '../ProcessedOrg'
import { Backlinks } from './Backlinks'
import { Citations } from './Citations'

export interface NoteProps {
  page: string
  fileData: OrgFileData
  data: FilesData
  slug: string
  toc: NoteHeading[]
  commits: CommitPerDateLog
  csl: CSLCitation[]
}

export const Note = (props: NoteProps) => {
  const { toc, fileData, page, data, slug, commits, csl } = props
  const { title, tags, ctime, mtime, backLinks, citations, citation } = fileData

  return (
    <Flex style={{ scrollBehavior: 'smooth' }}>
      <Container maxW="75ch" my={6}>
        <Heading variant="org" mb={4}>
          {slug}
        </Heading>
        <HStack my={2} spacing={2}>
          {!tags.includes('chapter') &&
            tags.map((tag: string) => (
              <Tag key={tag} variant="outline">
                {tag}
              </Tag>
            ))}
        </HStack>
        <VStack mb={4} alignItems="flex-start">
          {ctime && <Text fontSize={12}>Created on {parseTime(ctime)}</Text>}
          {mtime && <Text fontSize={12}>Last modified {parseTime(mtime)}</Text>}
        </VStack>
        <ProcessedOrg text={page} data={data} />
        {backLinks?.length && <Backlinks {...{ data, backLinks }} />}
        {citations?.length && <Citations {...{ csl }} />}

        <CommentBox {...{ title }} />
      </Container>
      <OutlineBox {...{ headings: toc, commits }} />
    </Flex>
  )
}
