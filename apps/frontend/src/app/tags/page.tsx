import { Octokit } from '@octokit/rest'
import { Redis } from '@upstash/redis'
import Link from 'next/link'
import yauzl from 'yauzl'
import { env } from '../../env/server'

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
export const getProps = async () => {
  const octokit = new Octokit({
    auth: env.GITHUB_PAT,
  })

  const currentRepo = await octokit.repos.getCommit({
    owner: env.REPO_OWNER,
    repo: env.REPO,
    ref: env.DEFAULT_BRANCH ?? 'main',
  })

  const { sha } = currentRepo.data

  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  })

  const redisTags = await redis.get(`tags:${sha}`)

  if (redisTags) {
    return redisTags
  }

  const repo = await octokit.repos.downloadZipballArchive({
    owner: env.REPO_OWNER,
    repo: env.REPO,
    ref: env.DEFAULT_BRANCH ?? 'main',
  })
  console.log(repo)

  const tags: Promise<Record<string, string[]>> = new Promise((resolve, reject) => {
    yauzl.fromBuffer(
      Buffer.from(repo.data as ArrayBuffer),
      { lazyEntries: true },
      (err, zipfile) => {
        if (err) reject(err)

        zipfile.readEntry()

        zipfile.on('entry', (entry) => {
          if (/\/$/.test(entry.fileName) || !entry.fileName.endsWith('.md')) {
            zipfile.readEntry()
          } else {
            zipfile.openReadStream(entry, (err, readStream) => {
              if (err) reject(err)

              const body = []

              readStream.on('data', (chunk) => {
                body.push(chunk)
              })

              readStream.on('end', () => {
                const file = Buffer.concat(body).toString()
                const fileTs = file.match(/\s*tags:\s*\n(\s*-\s.*?\n)+/gm)?.join('')
                const fileTags = fileTs
                  ?.replace(/\s*tags:\s*\n\s*/gm, '')
                  ?.replace(/\s*-\s*(.*?)\n/gm, '$1,')
                  ?.split(',')
                  .filter(Boolean)

                console.log({ file })
                console.log({ fileTags })
                fileTags?.forEach((tag) => {
                  if (!tags[tag]) {
                    tags[tag] = []
                  }
                  tags[tag].push(entry.fileName)
                })

                zipfile.readEntry()
              })
            })
          }
        })

        zipfile.on('end', async () => {
          await redis.set(`tags:${sha}`, JSON.stringify(tags), { ex: 60 * 60 })

          resolve(tags)
        })
      },
    )
  })
  return tags
}

const TagPage = async () => {
  const props = await getProps()
  console.log(props)
  const tags = props
  return (
    <div className="prose">
      <h1>TagPage</h1>
      <ul>
        {Object.entries(tags).map(([tag, file]): [string, string[]] => (
          <li key={tag}>
            <h2>{tag}</h2>
            <ul>
              {file.map((f) => {
                const betterName = f.replace(/.*?\//, '/note/').replace(/\.mdx?/, '')
                return (
                  <li key={f}>
                    <Link href={betterName}>{betterName}</Link>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TagPage
