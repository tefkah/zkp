import fs from 'fs'
import { GetStaticPaths, GetStaticProps } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import Link from 'next/link'
import { join } from 'path'
import { BasicLayout } from '../../components/Layouts'
import { postFilePaths } from '../../utils/mdx/mdxUtils'
import { mdxSerialize } from '../../utils/mdx/mdxSerialize'
import { createMdxRehypeReactCompents } from '../../components/MDXComponents/mdxRehypeReactComponents'
import { deslugify, slugify } from '../../utils/slug'
import { mdxDataByName } from '../../utils/mdx/mdxDataByName'
import { NOTE_DIR } from '../../utils/paths'

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
// const components = {
//   a: CustomLink,
//   // It also works with dynamically-imported components, which is especially
//   // useful for conditionally loading components for certain routes.
//   // See the notes in README.md for more details.
//   TestComponent: dynamic(() => import('../../components/TestComponent')),
//   Head,

// }

export const PostPage = (props: {
  source: MDXRemoteSerializeResult<Record<string, any>>
  frontMatter: { [key: string]: any }
  data: any
}) => {
  const { source, frontMatter, data } = props
  const comps = createMdxRehypeReactCompents(frontMatter?.id ?? 'aath', data)
  console.log(source)
  return (
    <BasicLayout>
      <header>
        <nav>
          <Link href="/">
            <a>👈 Go back home</a>
          </Link>
        </nav>
      </header>
      <div className="post-header">
        <h1>{frontMatter.title}</h1>
        {frontMatter.description && <p className="description">{frontMatter.description}</p>}
      </div>
      <main>
        {/* @ts-expect-error MDX remote does not want "null", but it's fineee */}
        <MDXRemote {...source} components={comps} />
      </main>

      <style jsx>{`
        .post-header h1 {
          margin-bottom: 0;
        }

        .post-header {
          margin-bottom: 2rem;
        }
        .description {
          opacity: 0.6;
        }
      `}</style>
    </BasicLayout>
  )
}

export default PostPage

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = (await postFilePaths())
    // Remove file extensions for page paths
    .map((path) => slugify(path.replace(/\.mdx?$/, '').toLowerCase()))
    // Map the path into the static paths object required by Next.js
    .map((slug) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = (Array.isArray(params?.slug) ? params?.slug.join('/') : params?.slug) ?? ''
  const data = await mdxDataByName()
  const fullpath = data[deslugify(slug)].path
  const postFilePath = join(NOTE_DIR, fullpath)
  const input = fs.readFileSync(postFilePath, 'utf8')

  const bibliography = join(NOTE_DIR, '.bibliography', 'Academic.bib')

  const { frontMatter, source } = await mdxSerialize(input, bibliography)

  return {
    props: {
      source,
      frontMatter,
      data,
    },
  }
}
