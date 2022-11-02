'use client'

import { MDXRemote, MDXRemoteProps, MDXRemoteSerializeResult } from 'next-mdx-remote'
import Image from 'next/image'
import React, { useMemo } from 'react'
import HoverLink from './HoverLink'

export interface LinkObject {
  [key: string]: {
    linkTitle: string
    title: string
    text: MDXRemoteSerializeResult
    frontMatter: Record<string, any>
    path: string
  }
}

const components = (linkies: LinkObject): MDXRemoteProps['components'] => ({
  img: (props) => (
    <span className="w-full flex items-center justify-center">
      <Image
        {...props}
        width={props.width ?? 200}
        src={`https://raw.githubusercontent.com/${process.env.NEXT_PUBLIC_REPO_OWNER}/${process.env.NEXT_PUBLIC_REPO}/${process.env.NEXT_PUBLIC_DEFAULT_BRANCH}/${props.src}`}
        height={props.height ?? 200}
        unoptimized
      />
    </span>
  ),
  a: (props) => {
    const { href, children } = props
    if (!href || !linkies[href]?.text) {
      console.log(href)
      return <span className="text-slate-400">{children}</span>
    }

    if (href.startsWith('http')) {
      return <a href={href}>{children}</a>
    }

    return (
      <HoverLink href={href} text={linkies[href]?.text}>
        {children}
      </HoverLink>
    )
  },
})

const Note = ({
  linkies,
  mdx,
}: {
  linkies: LinkObject
  mdx: {
    frontMatter: Record<string, any>
    source: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, string>>
  }
}) => {
  const comps = useMemo(() => components(linkies), [linkies])
  return <MDXRemote {...mdx?.source} components={comps} />
}

export default Note
