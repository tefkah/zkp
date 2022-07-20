/* eslint-disable react/jsx-props-no-spreading */
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { useMemo } from 'react'
// import { BsCartCheckFill } from 'react-icons/bs'
import { createMdxRehypeReactCompents } from '../MDXComponents'

export interface MDXNoteProps {
  currentId: string
  source: MDXRemoteSerializeResult
}
export const MDXNote = (props: MDXNoteProps) => {
  const { currentId, source } = props
  const comps = useMemo(() => createMdxRehypeReactCompents(currentId), [currentId])

  try {
    return (
      <article className="prose prose-slate dark:prose-invert">
        <MDXRemote {...source} components={comps} />
      </article>
    )
  } catch (e) {
    console.error(e)
    return (
      <article className="prose prose-slate dark:prose-slate">
        <p>Whoops, something went wrong rendering here.</p>
        <p>{e as string}</p>
      </article>
    )
  }
}
