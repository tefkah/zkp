import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  InferGetServerSidePropsType,
} from 'next'
// eslint-disable-next-line import/extensions, import/order
import { env } from '../env/server.js'
// import Link from 'next/link.js'
import { MDXRemote, MDXRemoteProps, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { Octokit } from '@octokit/rest'
import { mdxSerialize } from '@zkp/mdxSerialize'
import 'katex/dist/katex.css'
import React, { useState } from 'react'
// import { Portal } from '@headlessui/react'
import { Popover } from '@zkp/popover'
import { Redis } from '@upstash/redis'
import { fileListReducer } from '@zkp/folders'
import { DataBy, NextJSCompatibleStats, RecursiveFolder } from '@zkp/types'
import Link from 'next/link.js'
import Head from 'next/head.js'
import Image from 'next/future/image'

interface LinkObject {
  [key: string]: {
    linkTitle: string
    title: string
    text: MDXRemoteSerializeResult
    frontMatter: Record<string, any>
    path: string
  }
}

const makeURI = (path: string) =>
  encodeURIComponent(path?.replace(/\.mdx?$/, '')).replace(/%2F/g, '/')

export const getStaticPaths: GetStaticPaths = async () => {
  let dir: {
    path?: string | undefined
    mode?: string | undefined
    type?: string | undefined
    sha?: string | undefined
    size?: number | undefined
    url?: string | undefined
  }[] = []

  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  })
  const redisDir = await redis.get(`dir:${env.DEFAULT_BRANCH}`)

  if (redisDir) {
    dir = redisDir as typeof dir
  } else {
    const octokit = new Octokit({
      auth: env.GITHUB_PAT,
    })

    dir = (
      await octokit.git.getTree({
        owner: env.REPO_OWNER,
        repo: env.REPO,
        tree_sha: env.DEFAULT_BRANCH ?? 'main',
        recursive: 'true',
      })
    ).data.tree.filter((item) => item.type === 'blob' && item?.path?.endsWith('.md'))

    await redis.set(`dir:${env.DEFAULT_BRANCH}`, JSON.stringify(dir), {
      ex: 60 * 60,
    })
  }

  const paths = dir
    // .filter((file) => file.type === 'file' && file.path?.endsWith('.md'))
    .map((file) => {
      const slug = file.path?.replace(/\.mdx?$/, '')
      return {
        params: {
          note: slug?.split('/'),
        },
      }
    })

  console.dir(paths, { depth: null })
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  })

  const { params } = context
  if (!params) {
    return {
      props: {
        rawNote: 'no params',
      },
    }
  }
  const { note, branch } = params ?? {}

  const currentBranch = branch ?? env.DEFAULT_BRANCH ?? 'main'

  const currentNote = typeof note === 'string' ? note : note?.join('/') ?? 'index'
  const rawNote = await (
    await fetch(
      `https://raw.githubusercontent.com/${env.REPO_OWNER}/${env.REPO}/${currentBranch}/${currentNote}.md`,
    )
  ).text()

  let dir: {
    path?: string | undefined
    mode?: string | undefined
    type?: string | undefined
    sha?: string | undefined
    size?: number | undefined
    url?: string | undefined
  }[] = []

  const redisDir = await redis.get(`dir:${currentBranch}`)
  if (redisDir && redisDir !== 'nil') {
    // console.log('redisDir', redisDir)
    dir = redisDir as typeof dir
  } else {
    const octokit = new Octokit({
      auth: env.GITHUB_PAT,
    })

    dir = (
      await octokit.git.getTree({
        owner: env.REPO_OWNER,
        repo: env.REPO,
        tree_sha: (currentBranch as string) ?? env.DEFAULT_BRANCH,
        recursive: 'true',
      })
    ).data.tree.filter((item) => item.type === 'blob' && item?.path?.endsWith('.md'))

    await redis.set(`dir:${currentBranch}`, JSON.stringify(dir), {
      ex: 60 * 60,
    })
  }

  const links =
    rawNote.match(/\[\[(.*?)\]\]/g)?.map((link) => {
      const [title, alias] = link.replace(/\[\[(.*?)(\|(.*?))?\]\]/, '$1±$3')?.split('±') ?? []
      const actualLink = dir.find((file) =>
        new RegExp(`\\b${title}\\b`, 'i').test(file?.path ?? ''),
      )
      return { title, alias, path: actualLink?.path ?? `${title}.md` }
    }) ?? []

  const linkTexts = (
    await Promise.all(
      links.map(async (link) => {
        const text = await (
          await fetch(
            `https://raw.githubusercontent.com/${env.REPO_OWNER}/${
              env.REPO
            }/${currentBranch}/${encodeURIComponent(link.path)}`,
          )
        ).text()

        return { ...link, text: text === '404: Not Found' ? null : text }
      }),
    )
  ).filter((link) => link.text)

  const linkies = await Promise.all(
    linkTexts?.map(async (link) => {
      const { title, alias, text, path } = link
      const linkTitle = alias || title
      const compiledText = await mdxSerialize(text)
      return [
        title,
        {
          path,
          linkTitle,
          title,
          text: compiledText.source,
          frontMatter: compiledText.frontMatter,
        },
      ]
      // acc[`/${makeURI(path)}`] = acc[title]
    }),
  )

  const linkMap: LinkObject = Object.fromEntries(linkies.filter((l) => l !== null))

  const mdx = await mdxSerialize(rawNote, {
    pageResolver: (page) => [makeURI(linkMap[page]?.path)],
  })

  const linkMapWithURL = linkies.map(([title, link]) => [`/${makeURI(link?.path)}`, link])

  const fileListToBeReduced: DataBy[string][] = dir.map(
    (file) =>
      ({
        basename: file?.path?.split('/').pop()?.replace('.md', '') ?? 'notes',
        path: file?.path ?? '/',
        stats: {
          atimeMs: 0,
          mtimeMs: 0,
          ctimeMs: 0,
          birthtimeMs: 0,
          atime: new Date(),
          mtime: new Date(),
          ctime: new Date(),
          birthtime: new Date(),
        },
        folders: file?.path?.split('/')?.slice(0, -1) ?? [],
        slug: file?.path?.replace('.md', '') ?? 'notes',
        fullPath: file?.path ?? '/',
        name: file?.path?.split('/').pop()?.replace('.md', '') ?? 'notes',
      } as DataBy[string]),
  )

  const recursiveDir = fileListReducer(fileListToBeReduced)

  return {
    props: {
      rawNote,
      linkies: Object.fromEntries(linkMapWithURL),
      mdx,
      note,
      recursiveDir,
    },
  }
}

const HoverLink = ({
  href,
  text,
  children,
}: {
  children: React.ReactNode
  href: string
  text: MDXRemoteSerializeResult
}) => {
  const mdx = React.useMemo(() => (text ? <MDXRemote {...text} /> : null), [text])
  return (
    <Popover placement="right" href={href} title={children as string}>
      <div className="prose prose-p:font-medium prose-headings:font-medium prose-sm dark:prose-invert w-80 bg-white m-2 shadow-[4px_4px_0_#000] border-2 overflow-clip border-black dark:bg-slate-400 p-5 max-h-80 overflow-y-scroll">
        <span>{children}</span>
        {mdx}
      </div>
    </Popover>
  )
}

const components = (linkies: LinkObject): MDXRemoteProps['components'] => ({
  img: (props) => (
    <Image
      {...props}
      width={props.width ?? 500}
      src={`https://raw.githubusercontent.com/${process.env.NEXT_PUBLIC_REPO_OWNER}/${process.env.NEXT_PUBLIC_REPO}/${process.env.NEXT_PUBLIC_DEFAULT_BRANCH}/${props.src}`}
      height={props.height ?? 500}
      unoptimized
    />
  ),
  a: (props) => {
    const { href, children } = props
    if (!href || !linkies[href]?.text) {
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
  rawNote,
  linkies,
  mdx,
  note,
  recursiveDir,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const comps = React.useMemo(() => components(linkies), [linkies])
  return (
    <>
      <Head>
        <title>{note?.at(-1)?.replace(/.+\//, '')}</title>
      </Head>
      <main className="flex">
        <nav className="w-64 border-r-2 bg-black text-white border-black h-screen text-sm overflow-y-scroll sticky top-0 p-4">
          <ul className="w-full gap-2 flex flex-col">
            {recursiveDir?.children?.map((dir) => (
              <li key={dir?.path ?? dir.name} className="w-full">
                {dir?.children?.length > 0 ? (
                  <details>
                    <summary>{dir?.name}</summary>
                    <ul>
                      {dir?.children?.map((child) => (
                        <li key={child?.path ?? child.name}>
                          {child?.children?.length > 0 && (
                            <ul>
                              {child?.children?.map((grandChild) => (
                                <li key={grandChild?.path ?? grandChild.name}>
                                  <Link href={`/${grandChild?.slug}`}>{grandChild?.name}</Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link
                    className="hover:-translate-x-1 rounded-full py-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_#fff] border-2 px-2 transition-all  border-transparent hover:border-white truncate text-ellipsis w-20"
                    href={`/${dir.slug}`}
                  >
                    {dir?.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <article className="w-full mx-auto my-10 prose prose-lg prose-p:font-medium dark:prose-invert">
          <h1>{note?.at(-1)?.replace(/.+\//, '')}</h1>
          <div className="flex gap-4">
            {mdx.frontMatter?.tags?.map((tag) => (
              <span
                key={tag}
                className="transition-all  text-black border-2 text-sm hover:shadow-[4px_4px_0_#000] bg-white hover:-translate-x-1 hover:-translate-y-1 rounded-full border-black px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
          <hr className="bg-black h-0.5" />
          <MDXRemote {...mdx.source} components={comps} />
        </article>
      </main>
    </>
  )
}

export default Note
