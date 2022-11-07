import React from 'react'
import { fileListReducer } from '@zkp/folders'
import { DataBy, NextJSCompatibleStats } from '@zkp/types'
import Link from 'next/link'

import { env } from '../../env/server'
import { env as clientEnv } from '../../env/client'
import { fetchDir } from './[note]/page'

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
        slug: encodeURIComponent(file?.path?.replace('.md', '') ?? 'notes'),
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
  console.log(clientEnv.NEXT_PUBLIC_FILTERED_DIRECTORIES)
  return (
    <main className="flex">
      <nav className="w-80 border-r bg-white text-black border-black h-screen text-sm overflow-y-scroll sticky top-14 p-4">
        <ul className="w-full gap-3 flex flex-col">
          {recursiveDir?.children.map((dir) =>
            clientEnv.NEXT_PUBLIC_FILTERED_DIRECTORIES?.includes(dir.name) ? null : (
              <li key={dir.name} className="w-full overflow-clip overflow-ellipsis">
                {dir.type === 'folder' && dir?.children?.length > 0 ? (
                  <details>
                    <summary className="text-base cursor-pointer font-medium">{dir?.name}</summary>
                    <ul className="px-4">
                      {dir?.children?.map((child) => (
                        <li key={child.name}>
                          {child.type === 'folder' && child?.children?.length > 0 ? (
                            <ul>
                              {child?.children?.map((grandChild) => (
                                <li key={grandChild.name}>
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
            ),
          )}
        </ul>
      </nav>
      <article className="w-full mx-auto my-10 prose prose-lg prose-p:font-medium dark:prose-invert">
        {children}
      </article>
    </main>
  )
}
export default Layout
