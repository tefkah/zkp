import { sign } from 'jsonwebtoken'

export function getJWT() {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iat: now - 60,
    exp: now + 10 * 60,
    iss: parseInt(process.env.GITHUB_APP_ID!),
  }
  const key = process.env.PRIVATE_KEY?.replace(/\\n/g, '\n')
  return sign(payload, key || '', { algorithm: 'RS256' })
}
