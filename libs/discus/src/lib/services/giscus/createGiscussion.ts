// ported from the great https://github.com/giscus/giscus

// from Giscus

import { GCreateDiscussionInput } from '@zkp/types'

export const createGiscussion = async (
  repo: string,
  input: GCreateDiscussionInput,
): Promise<string> => {
  const { id } = await fetch(`/api/discussions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ repo, input }),
  }).then((r) => r.json())
  return id
}
