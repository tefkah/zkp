// ported from the great https://github.com/giscus/giscus

// from Giscus

import { GCreateDiscussionInput } from '../../types/github'

export const createDiscussion = async (
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
