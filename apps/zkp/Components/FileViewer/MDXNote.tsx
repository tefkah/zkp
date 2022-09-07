/* eslint-disable react/jsx-props-no-spreading */
import { useMDX } from '../../hooks/useMDX'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { useMemo } from 'react'
// import { BsCartCheckFill } from 'react-icons/bs'
import { createMdxRehypeReactCompents } from '../MDXComponents'
import { ChaoticOrbit } from '@uiball/loaders'
import 'katex/dist/katex.css'

export interface MDXNoteProps {
  currentId: string
  markdownContent: string
}
export const MDXNote = (props: MDXNoteProps) => {
  const { currentId, markdownContent } = props

  const { data, isLoading, error } = useMDX(markdownContent)
  const comps = useMemo(() => createMdxRehypeReactCompents(currentId), [currentId])
  const source = data?.source
  try {
    return (
      // eslint-disable-next-line no-nested-ternary
      isLoading ? (
        <ChaoticOrbit />
      ) : error || !source ? (
        <p>
          Something went wrong,{' '}
          <a className="text-red-500" href="https://github.com/thomasfkjorna/thesis-visualization">
            contact Thomas on Github
          </a>
        </p>
      ) : (
        <article className="prose prose-slate dark:prose-invert h-full">
          <MDXRemote {...source} components={comps} />
        </article>
      )
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
