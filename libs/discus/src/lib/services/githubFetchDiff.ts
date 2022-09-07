export const githubFetchDiff = async (repo: string, commit1: string, commit2: string) =>
  fetch(`https://api.github.com/repos/${repo}/compare/${commit1}...${commit2}`, {
    headers: {
      Accept: 'application/vnd.github.diff',
    },
  }).then((res) => res.text())
