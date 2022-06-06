// ported from the great https://github.com/giscus/giscus

import { IError, ITokenRequest, ITokenResponse } from '@zkp/types'

export const getToken = async (session: string) => {
  const result: ITokenResponse | IError = await fetch('/api/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ session } as ITokenRequest),
  }).then((r) => r.json())

  if ('error' in result) throw new Error(result.error)

  const { token } = result
  if (!token) throw new Error('Unable to retrieve token.')

  return token
}
