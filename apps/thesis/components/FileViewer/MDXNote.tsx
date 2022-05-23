/* eslint-disable react/jsx-props-no-spreading */
import { Box } from '@chakra-ui/react'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { useMemo } from 'react'
import { createMdxRehypeReactCompents } from '../MDXComponents'

export interface MDXNoteProps {
  currentId: string
  source: MDXRemoteSerializeResult
}
export const MDXNote = (props: MDXNoteProps) => {
  const { currentId, source } = props
  const comps = useMemo(() => createMdxRehypeReactCompents(currentId), [currentId])
  return (
    <article className="prose prose-slate">
      <MDXRemote {...source} components={comps} />
    </article>
  )
}
