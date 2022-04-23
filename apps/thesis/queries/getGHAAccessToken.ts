import { getJWT } from './getJWTToken'

export async function getGHAAccessToken(jwt: string) {
  const { id } = (
    await (
      await fetch(`https://api.github.com/app/installations`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${jwt}`, Accept: 'application/vnd.github.v3+json' },
      })
    ).json()
  )?.[0]

  const { token } = await fetch(`https://api.github.com/app/installations/${id}/access_tokens`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}`, Accept: 'application/vnd.github.v3+json' },
  }).then((res) => res.json())
  return token
}
