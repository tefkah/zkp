import { fetchCommit } from '../../note/[note]/History'
import { env } from '../../../env/server'
import { patchAndNewTextToRichDiff } from 'apps/frontend/src/utils/patchNoteToRichDiff'
import Note from '../../note/[note]/Note'
import { Commit } from './Commit'

const CommitPage = async ({
  params,
}: {
  params: {
    commit: string | string[]
  }
}) => {
  const { commit } = params

  const firstCommit = typeof commit === 'string' ? commit : commit[0]

  const data = await fetchCommit({
    redisToken: env.UPSTASH_REDIS_REST_TOKEN,
    redisUrl: env.UPSTASH_REDIS_REST_URL,
    repoName: env.REPO,
    repoOwner: env.REPO_OWNER,
    sha: firstCommit,
  })

  return (
    <main>
      <h1>{data?.commit?.message}</h1>
      {data?.files?.map((file) => (
        <Commit key={file.filename} file={file} />
      ))}
    </main>
  )
}

export default CommitPage
