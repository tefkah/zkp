import React from 'react'
import useSWR from 'swr'
import { BaseNote, NoteProps } from './BaseNote'

export interface StackedNoteProps
  extends Omit<NoteProps, 'page' | 'slug' | 'fileData' | 'toc' | 'commits' | 'csl'> {
  id: string
}

export const StackedNote = (props: StackedNoteProps) => {
  const { id, data, index, stackData, stackedNotes } = props
  const { data: file } = useSWR(`/api/file/byId/${id}`)
  const { data: meta } = useSWR(`/api/meta/byId/${id}`)
  // if (!file || !meta) {
  //   return <Spinner />
  // }
  // const text = file.file
  // const fileData = meta.meta
  return file && meta ? (
    <BaseNote
      page={file?.file}
      fileData={meta?.meta}
      data={data}
      slug={meta?.meta?.title}
      toc={[]}
      commits={{}}
      csl={[]}
      {...{ stackedNotes, index, stackData }}
    />
  ) : null
}
