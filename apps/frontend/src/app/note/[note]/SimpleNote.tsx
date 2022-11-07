'use client'

import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote'

export const SimpleNote = ({ mdx }: { mdx: MDXRemoteProps }) => {
  return <MDXRemote {...mdx} />
}
