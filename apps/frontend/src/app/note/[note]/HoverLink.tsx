'use client'

import { Popover } from '@zkp/popover'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { useMemo } from 'react'

const HoverLink = ({
  href,
  text,
  children,
}: {
  children: React.ReactNode
  href: string
  text: MDXRemoteSerializeResult
}) => {
  const mdx = useMemo(() => (text ? <MDXRemote {...text} /> : null), [text])
  return (
    <Popover
      enter=""
      leave=""
      closeDelay={0}
      openDelay={0}
      placement="left-end"
      href={href}
      title={children as string}
    >
      <div className="prose prose-p:font-medium prose-headings:font-medium prose-sm dark:prose-invert w-80 bg-white m-2 shadow-[4px_4px_0_#000] border-2 overflow-clip border-black dark:bg-slate-400 p-5 max-h-80 overflow-y-scroll">
        <span>{children}</span>
        {mdx}
      </div>
    </Popover>
  )
}
export default HoverLink
