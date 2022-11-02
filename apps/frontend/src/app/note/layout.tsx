import React from 'react'
import { fileListReducer } from '@zkp/folders'
import { DataBy, NextJSCompatibleStats } from '@zkp/types'
import Link from 'next/link'

import { env } from '../../env/server'
import { fetchDir } from './[...note]/page'

const fileListPreReducer = (
  dir: {
    path?: string | undefined
    mode?: string | undefined
    type?: string | undefined
    sha?: string | undefined
    size?: number | undefined
    url?: string | undefined
  }[],
): DataBy[string][] =>
  dir.map(
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
        } as unknown as NextJSCompatibleStats,
        folders: file?.path?.split('/')?.slice(0, -1) ?? [],
        slug: file?.path?.replace('.md', '') ?? 'notes',
        fullPath: file?.path ?? '/',
        name: file?.path?.split('/').pop()?.replace('.md', '') ?? 'notes',
      } as DataBy[string]),
  )

// return dir

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const dir = await fetchDir({
    branch: env.DEFAULT_BRANCH ?? 'main',
    repoOwner: env.REPO_OWNER,
    repoName: env.REPO,
    redisToken: env.UPSTASH_REDIS_REST_TOKEN,
    redisUrl: env.UPSTASH_REDIS_REST_URL,
  })
  const recursiveDir = fileListReducer(fileListPreReducer(dir))
  return (
    <main className="flex">
      <nav className="w-64 border-r-2 bg-black text-white border-black h-screen text-sm overflow-y-scroll sticky top-0 p-4">
        <ul className="w-full gap-2 flex flex-col">
          {recursiveDir?.children.map((dir) => (
            <li key={dir.name} className="w-full">
              {dir.type === 'folder' && dir?.children?.length > 0 ? (
                <details>
                  <summary>{dir?.name}</summary>
                  <ul>
                    {dir?.children?.map((child) => (
                      <li key={child?.path ?? child.name}>
                        {child.type === 'folder' && child?.children?.length > 0 ? (
                          <ul>
                            {child?.children?.map((grandChild) => (
                              <li key={grandChild?.path ?? grandChild.name}>
                                <Link href={`/note/${grandChild?.slug}`}>{grandChild?.name}</Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <Link
                            className="hover:-translate-x-1 rounded-full py-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_#fff] border-2 px-2 transition-all  border-transparent hover:border-white truncate text-ellipsis w-20"
                            href={`/note/${child?.slug}`}
                          >
                            {child?.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <Link
                  className="hover:-translate-x-1 rounded-full py-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_#fff] border-2 px-2 transition-all  border-transparent hover:border-white truncate text-ellipsis w-20"
                  href={`/note/${dir.slug}`}
                >
                  {dir?.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <article className="w-full mx-auto my-10 prose prose-lg prose-p:font-medium dark:prose-invert">
        {children}
      </article>
    </main>
  )
}
export default Layout
