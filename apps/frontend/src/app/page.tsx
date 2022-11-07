import { Octokit, RestEndpointMethodTypes } from '@octokit/rest'
import { Redis } from '@upstash/redis'
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
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  })

  const cached = await redis.get(`lastFiveCommits:${env.DEFAULT_BRANCH}`)
  let lastFiveCommits: RestEndpointMethodTypes['repos']['listCommits']['response']['data'] = []

  if (cached) {
    lastFiveCommits =
      cached as RestEndpointMethodTypes['repos']['listCommits']['response']['data'][]
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

  await redis.set(`lastFiveCommits:${env.DEFAULT_BRANCH}`, data, {
    ex: 60 * 60,
  })

  const fullCommits = await Promise.all(
    data.map(async (commit) => {
      const data = await fetchCommit({
        repoOwner: env.REPO_OWNER,
        repoName: env.REPO,
        redisUrl: env.UPSTASH_REDIS_REST_URL,
        redisToken: env.UPSTASH_REDIS_REST_TOKEN,
        sha: commit.sha,
      })
      return data
    }),
  )

  return fullCommits
})

const Page = async () => {
  // const text = await getMarkdown()

  const lastFiveCommits = await getLastFiveCommits()
  console.log(lastFiveCommits)

  return (
    <main className="min-h-screen w-screen flex flex-col items-center ">
      {lastFiveCommits.map((commit) => {
        const { additions, deletions, filesChanged } = getMDStats(commit)

        return (
          <div key={commit.sha} className="w-1/2">
            <h1 className="text-2xl font-bold">{commit.commit.message}</h1>

            <p className="text-sm text-gray-500">
              {commit.commit.author.name} committed on{' '}
              {new Date(commit.commit.author.date).toLocaleDateString()}
            </p>

            <p className="text-sm text-gray-500">
              {additions} additions, {deletions} deletions, {filesChanged} files changed
            </p>

            <p className="text-sm">{commit.commit.author.name}</p>
            <p className="text-sm">{commit.commit.author.date}</p>
            {/* list three files with the most changes */}
            <ul>
              {commit?.files
                ?.filter((file) => /\.mdx?/.test(file.filename))
                .map((file) => (
                  <li key={file.filename}>
                    <p>{file.filename}</p>
                    <p>{file.changes}</p>
                  </li>
                ))}
            </ul>
          </div>
        )
      })}
    </main>
  )
}

export default Page
