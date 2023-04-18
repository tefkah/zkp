import { Octokit } from '@octokit/rest'
import { mdxSerialize } from '@zkp/mdxSerialize'
import React, { cache } from 'react'
import { Redis } from '@upstash/redis'
import Note, { LinkObject } from './Note'
import { env } from '../../../env/server'
import { fetchCommitsForNote, History } from './History'
import { PreviousVersions } from './PreviousVersions'

export const fetchNote = async ({
  repoOwner,
  repoName,
  branch,
  note,
}: {
  repoOwner: string
  repoName: string
  branch: string
  note: string
}) => {
  const rawNote = await fetch(
    `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${note}.md`,
  )
  return rawNote.text()
}
const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string

const makeURI = (path: string) => encodeURIComponent(path?.replace(/\.mdx?$/, ''))

// export const getStaticPaths: GetStaticPaths = async () => {
//   let dir: {
//     path?: string | undefined
//     mode?: string | undefined
//     type?: string | undefined
//     sha?: string | undefined
//     size?: number | undefined
//     url?: string | undefined
//   }[] = []

//   const redis = new Redis({
//     url: env.UPSTASH_REDIS_REST_URL,
//     token: env.UPSTASH_REDIS_REST_TOKEN,
//   })
//   const redisDir = await redis.get(`dir:${env.DEFAULT_BRANCH}`)

//   if (redisDir) {
//     dir = redisDir as typeof dir
//   } else {
//     const octokit = new Octokit({
//       auth: env.GITHUB_PAT,
//     })

//     dir = (
//       await octokit.git.getTree({
//         owner: env.REPO_OWNER,
//         repo: env.REPO,
//         tree_sha: env.DEFAULT_BRANCH ?? 'main',
//         recursive: 'true',
//       })
//     ).data.tree.filter((item) => item.type === 'blob' && item?.path?.endsWith('.md'))

//     await redis.set(`dir:${env.DEFAULT_BRANCH}`, JSON.stringify(dir), {
//       ex: 60 * 60,
//     })
//   }

//   const paths = dir
//     // .filter((file) => file.type === 'file' && file.path?.endsWith('.md'))
//     .map((file) => {
//       const slug = file.path?.replace(/\.mdx?$/, '')
//       return {
//         params: {
//           note: slug?.split('/'),
//         },
//       }
//     })

//   console.dir(paths, { depth: null })
//   return {
//     paths,
//     fallback: false,
//   }
// }
export const fetchDir = cache(
  async ({
    repoOwner,
    repoName,
    branch,
    redisUrl,
    redisToken,
  }: {
    repoOwner: string
    repoName: string
    branch: string
    redisUrl: string
    redisToken: string
  }) => {
    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    })

    let dir: {
      path?: string | undefined
      mode?: string | undefined
      type?: string | undefined
      sha?: string | undefined
      size?: number | undefined
      url?: string | undefined
    }[] = []

    const redisDir = await redis.get(`dir:${branch}`)
    if (redisDir && redisDir !== 'nil') {
      // console.log('redisDir', redisDir)
      dir = redisDir as typeof dir
    } else {
      const octokit = new Octokit({
        auth: env.GITHUB_PAT,
      })

      dir = (
        await octokit.git.getTree({
          owner: repoOwner,
          repo: repoName,
          tree_sha: branch as string,
          recursive: 'true',
        })
      ).data.tree.filter((item) => item.type === 'blob' && item?.path?.endsWith('.md'))

      await redis.set(`dir:${branch}`, JSON.stringify(dir), {
        ex: 60 * 60,
      })
    }
    return dir
  },
)

export const getProps = async (params: { note: string | string[]; branch?: string }) => {
  if (!params) {
    return {
      props: {
        rawNote: 'no params',
      },
    }
  }
  const { note, branch } = params ?? {}

  const currentBranch = branch ?? env.DEFAULT_BRANCH ?? 'main'

  const currentNote =
    typeof note === 'string' ? decodeURIComponent(note) : note?.join('/') ?? 'index'

  const rawNote = await fetchNote({
    repoOwner: env.REPO_OWNER,
    repoName: env.REPO,
    branch: currentBranch,
    note: currentNote,
  })
  // const currentNote = note

  const dir = await fetchDir({
    repoOwner: env.REPO_OWNER,
    repoName: env.REPO,
    branch: currentBranch,
    redisUrl: env.UPSTASH_REDIS_REST_URL,
    redisToken: env.UPSTASH_REDIS_REST_TOKEN,
  })

  const links =
    rawNote.match(/\[\[(.*?)\]\]/g)?.map((link) => {
      const [title, alias] = link.replace(/\[\[(.*?)(\|(.*?))?\]\]/, '$1±$3')?.split('±') ?? []
      const actualLink = dir.find((file) =>
        new RegExp(`(^|/)${escapeRegExp(title)}\\.md`, 'i').test(file?.path ?? ''),
      )
      return { title, alias, path: actualLink?.path ?? `${title}.md` }
    }) ?? []

  const linkTexts = (
    await Promise.all(
      links.map(async (link) => {
        const text = await fetchNote({
          repoOwner: env.REPO_OWNER,
          repoName: env.REPO,
          branch: currentBranch,
          note: encodeURIComponent(link.path.replace(/\.mdx?$/, '')),
        })
        //   await fetch(
        //     `https://raw.githubusercontent.com/${env.REPO_OWNER}/${
        //       env.REPO
        //     }/${currentBranch}/${encodeURIComponent(link.path)}`,
        //   )
        // ).text()

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
    pageResolver: (page) => [`/note/${makeURI(linkMap[page]?.path)}`],
  })

  const linkMapWithURL = linkies.map(([title, link]) => [`/note/${makeURI(link?.path)}`, link])

  // const fileListToBeReduced: DataBy[string][] = dir.map(
  //   (file) =>
  //     ({
  //       basename: file?.path?.split('/').pop()?.replace('.md', '') ?? 'notes',
  //       path: file?.path ?? '/',
  //       stats: {
  //         atimeMs: 0,
  //         mtimeMs: 0,
  //         ctimeMs: 0,
  //         birthtimeMs: 0,
  //         atime: new Date(),
  //         mtime: new Date(),
  //         ctime: new Date(),
  //         birthtime: new Date(),
  //       },
  //       folders: file?.path?.split('/')?.slice(0, -1) ?? [],
  //       slug: file?.path?.replace('.md', '') ?? 'notes',
  //       fullPath: file?.path ?? '/',
  //       name: file?.path?.split('/').pop()?.replace('.md', '') ?? 'notes',
  //     } as DataBy[string]),
  // )

  // const recursiveDir = fileListReducer(fileListToBeReduced)

  return {
    rawNote,
    linkies: Object.fromEntries(linkMapWithURL),
    mdx,
    // recursiveDir,
  }
}

const Page = async ({
  params: { note },
  searchParams,
}: {
  params: { note: string }
  searchParams: {
    history: string
  }
}) => {
  const { linkies, mdx } = await getProps({ note })
  const { history } = searchParams

  return (
    <>
      <div>{typeof note !== 'string' && note.slice(0, -1).join('/')}</div>
      <h1>{decodeURIComponent(note)?.replace(/.+\//, '')}</h1>
      <div className="flex gap-4">
        {mdx?.frontMatter?.tags?.map((tag) => (
          <span
            key={tag}
            className="transition-all  text-black border-2 text-sm hover:shadow-[4px_4px_0_#000] bg-white hover:-translate-x-1 hover:-translate-y-1 rounded-full  border-black px-2 py-1"
          >
            {tag}
          </span>
        ))}
      </div>
      <hr className="bg-black h-0.5" />
      <Note mdx={mdx} linkies={linkies} />
      {history && (
        <>
          <History note={note} />
          <PreviousVersions note={note} />
        </>
      )}
    </>
  )
}

export default Page
