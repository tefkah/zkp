import { getCommits } from '../utils/getListOfCommitsWithStats'

export default function AAAA({ commit }) {
  return (
    <div>
      <p>this should be a static page, which shows all the files CHANGED at this commit.</p>
      <p>
        Each of the files at this commit should be a file which shows the differences between this
        commit and the last.
      </p>
      <p>
        There should also be an option to view ALL the files at this commit, but this should not be
        static (would be too much to keep track of, not worth it.
      </p>
      <p>{commit}</p>
    </div>
  )
}

export async function getStaticPaths() {
  const commitList = await getCommits()
  const commitIndexList = commitList.map((commit) => ({ params: { commit: commit.oid } }))
  return {
    paths: commitIndexList,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const { commit } = params
  console.log(params)
  return { props: { commit } }
}
