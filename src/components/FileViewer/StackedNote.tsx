import {
  Flex,
  Container,
  Heading,
  Tag,
  HStack,
  VStack,
  Spinner,
  Box,
  Skeleton,
} from '@chakra-ui/react'
import { title } from 'process'
import React from 'react'
import useSWR from 'swr'
import { parseTime } from '../../utils/parseTime'
import { slugify } from '../../utils/slug'
import CommentBox from '../discs/CommentBox'
import { OutlineBox } from '../OutlineBox/OutlineBox'
import { ProcessedOrg } from '../ProcessedOrg'
import { Backlinks } from './Backlinks'
import { BaseNote, NoteProps } from './BaseNote'
import { Citations } from './Citations'

export interface StackedNoteProps
  extends Omit<NoteProps, 'page' | 'slug' | 'fileData' | 'toc' | 'commits' | 'csl'> {
  id: string
}

export const StackedNote = (props: StackedNoteProps) => {
  const { id, data, index, stackData } = props
  const { data: file, error: fileError } = useSWR(`/api/file/byId/${id}`)
  const { data: meta, error: fileDataError } = useSWR(`/api/meta/byId/${id}`)
  // if (!file || !meta) {
  //   return <Spinner />
  // }
  // const text = file.file
  // const fileData = meta.meta
  return (
    <>
      {file && meta && (
        <BaseNote
          stacked
          page={file?.file}
          fileData={meta?.meta}
          data={data}
          slug={meta?.meta?.title}
          toc={[]}
          commits={{}}
          csl={[]}
          {...{ index, stackData }}
        />
      )}
    </>
  )
}
