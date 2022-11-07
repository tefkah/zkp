// import { serialize } from 'next-mdx-remote/serialize'
import { mdxSerialize } from '@zkp/mdx'
import { patchAndNewTextToRichDiff } from '../../../utils/patchNoteToRichDiff'
import { fetchCommitsForNote, fetchCommit } from './History'
import { env } from '../../../env/server'
import { SimpleNote } from './SimpleNote'
import { fetchNote } from './page'
import { serialize } from 'next-mdx-remote/serialize'

export const PreviousVersions = async ({ note }: { note: string }) => {
  const currentNote = `${decodeURIComponent(note)}.md`
  const commits = await fetchCommitsForNote({
    repoOwner: env.REPO_OWNER,
    repoName: env.REPO,
    redisUrl: env.UPSTASH_REDIS_REST_URL,
    redisToken: env.UPSTASH_REDIS_REST_TOKEN,
    branch: env.DEFAULT_BRANCH ?? 'main',
    note: currentNote,
  })
  console.log(currentNote)

  let currentText = await fetchNote({
    repoOwner: env.REPO_OWNER,
    repoName: env.REPO,
    branch: env.DEFAULT_BRANCH ?? 'main',
    note: currentNote.replace(/\.mdx?$/, ''),
  })

  console.log('currentText', currentText)

  const previousVersions = (
    await Promise.all(
      commits.map(async (commit) => {
        const commitDetails = await fetchCommit({
          repoOwner: env.REPO_OWNER,
          repoName: env.REPO,
          redisUrl: env.UPSTASH_REDIS_REST_URL,
          redisToken: env.UPSTASH_REDIS_REST_TOKEN,
          sha: commit.sha,
        })

        const patch = commitDetails?.files?.find((file) => file.filename === currentNote)?.patch
        if (!patch) {
          console.log('no patch')
          console.log(commitDetails.files)
          return null
        }

        const { diff, prevText, richDiff, reversedPatch } = patchAndNewTextToRichDiff(
          patch,
          currentText,
        )
        currentText = prevText
        console.log('richdiff', richDiff)

        const mdxSource = await serialize(richDiff)

        return {
          sha: commit.sha,
          date: commit?.commit?.author?.date,
          patch,
          mdxSource,
        }
      }),
    )
  )?.filter(Boolean)

  console.log('previousversions', previousVersions)

  return (
    <div>
      {previousVersions.map((version) => {
        return (
          <div key={version.sha}>
            <SimpleNote mdx={version.mdxSource} />
          </div>
        )
      })}
    </div>
  )
}
