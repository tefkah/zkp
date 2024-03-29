/* eslint-disable no-console */
import { useMemo } from 'react'
// import { ParsedOrg } from '../../services/thesis/parseOrg'
import { MDXRemote } from 'next-mdx-remote'
import { ChaoticOrbit } from '@uiball/loaders'
// import { noteStyle } from '../NoteStyle'
// eslint-disable-next-line import/no-cycle
import { createMdxRehypeReactCompents } from '../MDXComponents'
// import { mdxFetcher } from '../../utils/fetchers/mdxFetcher'
import { useMDX } from '../../hooks/useMDX'

interface PopoverPreviewProps {
  href: string
  id: string
}
export const PopoverPreview = (props: PopoverPreviewProps) => {
  const { id, href } = props
  const { data, isError, isLoading } = useMDX(href)
  console.log(data)
  const comps = useMemo(() => createMdxRehypeReactCompents(id), [id])
  const source = data?.source
  return (
    <div className="prose-sm w-full px-3">
      {
        // eslint-disable-next-line no-nested-ternary
        isLoading ? (
          <ChaoticOrbit />
        ) : isError || !source ? (
          <p>
            Something went wrong,{' '}
            <a
              className="text-red-500"
              href="https://github.com/thomasfkjorna/thesis-visualization"
            >
              contact Thomas on Github
            </a>
          </p>
        ) : (
          <MDXRemote compiledSource={source.compiledSource} components={comps} />
          // <ParsedOrg type="popover" currentId={id!} text={data.file} />
        )
      }
    </div>
  )
}
