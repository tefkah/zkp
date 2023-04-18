import { env } from 'apps/frontend/src/env/server'
import { patchAndNewTextToRichDiff } from 'apps/frontend/src/utils/patchNoteToRichDiff'
import { serialize } from 'next-mdx-remote/serialize'
import { markdownToHTML } from '../../note/[note]/markdownToHTML'
import { fetchNote } from '../../note/[note]/page'
import { SimpleNote } from '../../note/[note]/SimpleNote'

export const Commit = async ({
  file,
}: {
  file: {
    filename: string
    additions: number
    deletions: number
    changes: number
    patch: string
  }
}) => {
  const { filename, additions, deletions, changes, patch } = file

  if (filename.endsWith('.mdx') || !filename.endsWith('.md')) {
    return null
  }

  const text = await fetchNote({
    repoOwner: env.REPO_OWNER,
    repoName: env.REPO,
    branch: env.DEFAULT_BRANCH ?? 'main',
    note: filename.replace(/\.mdx?$/, ''),
  })

  const { diff, prevText, richDiff, reversedPatch } = patchAndNewTextToRichDiff(
    patch,
    text,
    true,
    true,
  )

  // let mdxSource
  // try {
  //   mdxSource = await serialize(richDiff)
  // } catch (e) {
  //   console.log('error serializing', e)
  //   mdxSource = false
  // }

  const html = await markdownToHTML(richDiff)

  return (
    <div>
      <h2>{filename}</h2>
      <div>
        <h3>Changes</h3>
        <ul>
          <li>Additions: {additions}</li>
          <li>Deletions: {deletions}</li>
          <li>Changes: {changes}</li>
        </ul>
      </div>
      {/* {mdxSource && <SimpleNote mdx={mdxSource} />} */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
