// ported from the great https://github.com/giscus/giscus

import { ContentsResponse, GError } from '@zkp/types'

// eslint-disable-next-line prefer-destructuring
const GITHUB_REPOS_API_URL = process.env.GITHUB_REPOS_API_URL

export const getFile = async (repoWithOwner: string, path: string, token?: string) => {
  const response = await fetch(`${GITHUB_REPOS_API_URL}/${repoWithOwner}/contents/${path}`, {
    headers: token ? { Authorization: `token ${token}` } : {},
  })

  if (response.status === 404) {
    throw new Error(`Could not find ${path} in ${repoWithOwner} repository.`)
  }

  const data: ContentsResponse | GError = await response.json()

  if ('message' in data) {
    throw new Error(
      `Could not fetch ${path} from ${repoWithOwner} repository. Message: "${data.message}"`,
    )
  }

  return Buffer.from(data.content, 'base64').toString()
}

export const getJSONFile = async <T>(
  repoWithOwner: string,
  path: string,
  token?: string,
): Promise<T> => JSON.parse(await getFile(repoWithOwner, path, token))
