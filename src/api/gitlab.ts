export const fetchDiff = async (repo: string, commit1: string, commit2: string) => {
  console.log(repo)
  console.log(commit1)
  console.log(commit2)
  return fetch(
    `https://gitlab.com/api/v4/projects/thomasfkjorna%2fthesis-writings/repository/compare?from=${commit1}&to=${commit2}`,
  ).then((res) => res.json())
}
