export const fetchDiff = async (repo: string, commit1: string, commit2: string) => {
  return fetch(`https://api.github.com/repos/${repo}/compare/${commit1}...${commit2}`, {
    headers: {
      Accept: 'application/vnd.github.diff',
    },
  }).then((res) => {
    return res.text()
  })
}
