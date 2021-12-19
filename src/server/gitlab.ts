export const fetchDiff = async (repo: string, commit1: string, commit2: string) => {
  return fetch(
    `https://gitlab.com/api/v4/projects/thomasfkjorna%2fthesis-writing/repository/compare?from=${commit1}&to=${commit2}`,
  ).then((res) => res.json())
}
