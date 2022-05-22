import React from 'react'
// eslint-disable-next-line import/no-cycle
import { BaseNote, NoteProps } from './BaseNote'
import { useMDX } from '../../hooks/useMDX'

export interface StackedNoteProps
  extends Omit<NoteProps, 'page' | 'source' | 'slug' | 'fileData' | 'toc' | 'commits' | 'csl'> {
  id: string
}

export const StackedNote = (props: StackedNoteProps) => {
  const { id, index, stackedNotes } = props
  const { data: file } = useMDX(id)
  // const { data: meta } = useSWR(`/api/meta/bySlug/${id}`)
  // if (!file || !meta) {
  //   return <ChaoticOrbit />
  // }
  // const text = file.file
  // const fileData = meta.meta
  return file ? (
    <BaseNote
      source={file?.source}
      id={id}
      // id={meta.title}
      toc={[]}
      commits={{}}
      {...{ stackedNotes, index }}
    />
  ) : null
}
