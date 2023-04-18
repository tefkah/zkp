import { HomeModernIcon, MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { createClient } from 'redis'
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest'
import { Redis } from '@upstash/redis'
import Link from 'next/link'
import { cache } from 'react'
import { env } from '../env/server'
import { fetchCommit, getMDStats } from './note/[note]/History'

const getMarkdown = async () => {
  const res = await fetch(
    'https://raw.githubusercontent.com/tefkah/thesis-writing/main/A%20Space%20Is%20Just%20a%20Set%20with%20some%20Structure.md',
  )
  const text = await res.text()
  return text
}

const getLastFiveCommits = cache(async () => {
  // const redis = new Redis({
  //   url: env.UPSTASH_REDIS_REST_URL,
  //   token: env.UPSTASH_REDIS_REST_TOKEN,
  // })

  const redis = createClient({
    url: env.REDIS_URL,
  })

  redis.on('error', (err) => console.log('Redis Client Error', err))

  await redis.connect()

  const cached = await redis.get(`lastFiveCommits:${env.DEFAULT_BRANCH}`)
  console.log({ cached })
  let lastFiveCommits: RestEndpointMethodTypes['repos']['listCommits']['response']['data'][] = []

  if (cached) {
    lastFiveCommits = JSON.parse(
      cached,
    ) as RestEndpointMethodTypes['repos']['listCommits']['response']['data'][]
  }

  const octokit = new Octokit({
    auth: env.GITHUB_PAT,
  })

  const { data } = await octokit.repos.listCommits({
    owner: env.REPO_OWNER,
    repo: env.REPO,
    branch: env.DEFAULT_BRANCH,
    per_page: 5,
  })
  // console.log(data)

  await redis.set(`lastFiveCommits:${env.DEFAULT_BRANCH}`, JSON.stringify(data), {
    EX: 60 * 60,
  })

  const fullCommits = await Promise.all(
    data.map(async (commit) => {
      const comm = await fetchCommit({
        repoOwner: env.REPO_OWNER,
        repoName: env.REPO,
        redisUrl: env.UPSTASH_REDIS_REST_URL,
        redisToken: env.UPSTASH_REDIS_REST_TOKEN,
        sha: commit.sha,
      })
      return comm
    }),
  )

  console.log({ fullCommits })

  await redis.disconnect()

  return fullCommits
})

const Page = async () => {
  // const text = await getMarkdown()

  const lastFiveCommits = await getLastFiveCommits()
  console.dir(lastFiveCommits, { depth: null })

  return (
    <main className="min-h-screen w-screen px-10">
      <h1 className="text-4xl font-bold text-center">A Thesis</h1>
      <div>
        <h2>
          <span className="text-2xl font-bold">Lastest updates</span>
        </h2>
        <div className="grid grid-cols-5 gap-2">
          {lastFiveCommits.map((commit) => {
            const { additions, deletions, filesChanged } = getMDStats(commit)

            return (
              <div key={commit.sha} className="border border-black h-full p-3">
                <p className="text-sm text-stone-400">
                  {new Date(commit.commit.author.date).toLocaleDateString()}
                </p>
                <h2 className="my-1 leading-5 ">
                  <Link href={`/activity/${commit.sha}`}>{commit.commit.message}</Link>
                </h2>

                <p className="text-xs text-stone-500 flex items-center">
                  {additions}
                  <PlusCircleIcon className="h-4 w-4" /> {deletions}
                  <MinusCircleIcon className="h-4 w-4" /> {filesChanged}
                  <HomeModernIcon className="h-4 w-4" />
                </p>

                {/* list three files with the most changes */}
                <ul className="mt-4 flex flex-col gap-2 h-full">
                  {commit?.files
                    ?.filter((file) => /\.mdx?/.test(file.filename))
                    ?.sort((a, b) => b.changes - a.changes)
                    ?.slice(0, 3)
                    ?.map((file) => (
                      <li key={file.filename}>
                        <div className="flex gap-2 text-xs text-stone-400">
                          {file.filename
                            .split('/')
                            .slice(0, -1)
                            ?.map((dir) => (
                              <span key={dir}>{dir}</span>
                            ))}
                        </div>
                        <div className="flex w-full justify-between items-baseline">
                          <h3 className="font-light text-xs text-stone-800">
                            <Link
                              href={`/note/${encodeURIComponent(
                                file.filename.replace(/\.mdx?/, ''),
                              )}`}
                            >
                              {' '}
                              {file.filename
                                ?.split('/')
                                .pop()
                                ?.replace(/\.mdx?/, '')}{' '}
                            </Link>
                          </h3>
                          <div className="flex flex-col items-end text-xs">
                            <div className="flex items-center gap-1">
                              <span>{file.additions} </span>
                              <PlusCircleIcon className="w-3 h-3" />
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{file.deletions} </span>
                              <MinusCircleIcon className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  {commit?.files?.length > 3 && (
                    <p className="justify-self-end text-sm">
                      and {commit?.files?.length - 3} more files...
                    </p>
                  )}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default Page
