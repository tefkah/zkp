export const fetchDiff = async (repo: string, commit1: string, commit2: string) => {
  console.log(repo)
  console.log(commit1)
  console.log(commit2)
  return fetch(`https://api.github.com/repos/${repo}/compare/${commit1}...${commit2}`, {
    headers: {
      Accept: 'application/vnd.github.diff',
    },
  }).then((res) => {
    console.log(res.text())
    return res.text()
  })
}
