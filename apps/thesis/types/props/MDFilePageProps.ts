import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { DataBy } from '../notes'

export interface MDFilePageProps {
  source: MDXRemoteSerializeResult<Record<string, any>>
  name: string
  slug: string
  frontMatter: { [key: string]: any }
  // data: any
  fileList: DataBy
}
