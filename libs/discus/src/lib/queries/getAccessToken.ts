import { getJWT } from './getJWTToken'

import { getCachedAccessToken, setCachedAccessToken } from './cachedAccessToken'
import { GITHUB_ACCESS_TOKEN_URL, GITHUB_REPO_INSTALLATION_URL } from './queryConfig'

interface GAccessToken {
  token: string
  expires_at: string
  permissions: {
    discussions: string
    metadata: string
  }
  repository_selection: string
  repositories?: Array<unknown>
}

function getHeaders() {
  return {
    Authorization: `Bearer ${getJWT()}`,
    Accept: 'application/vnd.github.v3+json',
  }
}

async function getInstallationId(repoWithOwner: string): Promise<number> {
  const { id } = await fetch(GITHUB_REPO_INSTALLATION_URL(repoWithOwner), {
    headers: getHeaders(),
  })
    .then((response) => response.json())
    .catch((e) => console.error(e))
  return id
}

export async function getAppAccessToken(repoWithOwner: string): Promise<string> {
  const installationId =
    parseInt(process.env.DISCUSSIONS_INSTALL_ID || '') || (await getInstallationId(repoWithOwner))

  if (!installationId)
    throw {
      message:
        'thesis.tefkah.com is not installed on this repository, you probably messed something up',
      documentation_url:
        'https://docs.github.com/en/rest/reference/apps#get-a-repository-installation-for-the-authenticated-app',
    }

  const cachedToken = await getCachedAccessToken(installationId)

  if (cachedToken) return cachedToken

  const response = await fetch(GITHUB_ACCESS_TOKEN_URL(installationId), {
    method: 'POST',
    headers: getHeaders(),
  })

  if (!response.ok)
    throw {
      message: 'Failed fetching access token',
    }

  const { token, expires_at }: GAccessToken = await response.json()

  await setCachedAccessToken({
    installation_id: installationId,
    token,
    expires_at,
  })

  return token
}
