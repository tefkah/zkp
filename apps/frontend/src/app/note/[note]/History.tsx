import { Octokit, RestEndpointMethodTypes } from '@octokit/rest'
import { Redis } from '@upstash/redis'
import { cache } from 'react'
import { env } from '../../../env/server'

export const fetchCommitsForNote = cache(
  async ({
    repoOwner,
    repoName,
    branch,
    redisUrl,
    redisToken,
    note,
  }: {
    repoOwner: string
    repoName: string
    branch: string
    redisUrl: string
    redisToken: string
    note: string
  }): Promise<RestEndpointMethodTypes['repos']['listCommits']['response']['data']> => {
    // check redis for commits
    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    })

    const redisCommits = await redis.get(`commits:${branch}:${note}`)
    if (redisCommits && redisCommits !== 'nil') {
      return redisCommits as Promise<
        RestEndpointMethodTypes['repos']['listCommits']['response']['data']
      >
    }
    // console.log(note)

    const octokit = new Octokit({
      auth: env.GITHUB_PAT,
    })

    const commits = await octokit.repos.listCommits({
      owner: repoOwner,
      repo: repoName,
      sha: branch,
      path: note,
    })

    // console.log(commits.data)
    await redis.set(`commits:${branch}:${note}`, JSON.stringify(commits.data), {
      ex: 60 * 60,
    })

    return commits.data
  },
)

export const fetchCommit = cache(
  async ({
    repoOwner,
    repoName,
    redisUrl,
    redisToken,
    sha,
  }: {
    repoOwner: string
    repoName: string
    redisUrl: string
    redisToken: string
    sha: string
  }): Promise<RestEndpointMethodTypes['repos']['getCommit']['response']['data']> => {
    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    })

    const redisCommit = await redis.get(`commit:${sha}`)
    if (redisCommit && redisCommit !== 'nil') {
      return redisCommit as Promise<
        RestEndpointMethodTypes['repos']['getCommit']['response']['data']
      >
    }

    const octokit = new Octokit({
      auth: env.GITHUB_PAT,
    })

    const commit = await octokit.repos.getCommit({
      owner: repoOwner,
      repo: repoName,
      ref: sha,
    })

    await redis.set(`commit:${sha}`, JSON.stringify(commit.data))
    return commit.data
  },
)

export const getMDStats = (
  commit: RestEndpointMethodTypes['repos']['getCommit']['response']['data'],
) => {
  const [additions, deletions, filesChanged] = commit.files?.reduce(
    (acc, file) => {
      if (!/\.mdx?$/.test(file.filename)) {
        return acc
      }

      return [acc[0] + file.additions, acc[1] + file.deletions, acc[2] + 1]
    },
    [0, 0, 0],
  ) ?? [0, 0, 0]

  return { additions, deletions, filesChanged }
}

const CommitThing = async ({ sha }: { sha: string }) => {
  const commit = await fetchCommit({
    repoOwner: env.REPO_OWNER,
    repoName: env.REPO,
    redisUrl: env.UPSTASH_REDIS_REST_URL,
    redisToken: env.UPSTASH_REDIS_REST_TOKEN,
    sha,
  })

  const date = new Date(commit.commit.author.date)

  const { additions, deletions, filesChanged } = getMDStats(commit)
  // const deletions = commit.stats.deletions
  // const filesChanged = commit.files.length

  return (
    <li key={commit.sha} className="flex flex-col space-y-2">
      <a href={commit.html_url}>{commit.commit.message}</a>

      <time dateTime={date.toISOString()} className="text-sm ">
        {date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>

      {/* Additions and deletions */}
      <div className="flex space-x-2">
        <div className="flex items-center space-x-1">
          <svg
            className="w-4 h-4 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 12a2 2 0 100-4 2 2 0 000 4zm0 2a4 4 0 100-8 4 4 0 000 8z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 100-20 10 10 0 000 20z"
              clipRule="evenodd"
            />
          </svg>
          <span>{additions}</span>
        </div>

        <div className="flex items-center space-x-1">
          <svg
            className="w-4 h-4 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 12a2 2 0 100-4 2 2 0 000 4zm0 2a4 4 0 100-8 4 4 0 000 8z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 100-20 10 10 0 000 20z"
              clipRule="evenodd"
            />
          </svg>
          <span>{deletions}</span>
        </div>

        <div className="flex items-center space-x-1">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 12a2 2 0 100-4 2 2 0 000 4zm0 2a4 4 0 100-8 4 4 0 000 8z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 100-20 10 10 0 000 20z"
              clipRule="evenodd"
            />
          </svg>
          <span>{filesChanged}</span>
        </div>
      </div>
    </li>
  )
}

export const History = async ({ note }: { note: string | string[] }) => {
  const currentNote = typeof note === 'string' ? note : note?.join('/') ?? 'index'

  const commits = await fetchCommitsForNote({
    repoOwner: env.REPO_OWNER,
    repoName: env.REPO,
    branch: env.DEFAULT_BRANCH ?? 'main',
    redisUrl: env.UPSTASH_REDIS_REST_URL,
    redisToken: env.UPSTASH_REDIS_REST_TOKEN,
    note: `${decodeURIComponent(currentNote)}.md`,
  })

  console.dir(commits, { depth: null })
  return (
    <div className="prose prose-p:font-medium prose-headings:font-medium prose-sm dark:prose-invert w-80 bg-white m-2 shadow-[4px_4px_0_#000] border-2 overflow-clip border-black dark:bg-slate-400 p-5 overflow-y-scroll">
      <h3>History</h3>
      <ul>
        {commits.map((commit) => (
          <CommitThing key={commit.sha} sha={commit.sha} />
        ))}
      </ul>
    </div>
  )
}
