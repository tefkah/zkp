// ported from the great https://github.com/giscus/giscus

import { ToggleReactionBody, ToggleReactionResponse } from '@zkp/types'

const TOGGLE_REACTION_QUERY = (mode: 'add' | 'remove') => `
  mutation($content: ReactionContent!, $subjectId: ID!) {
    toggleReaction: ${mode}Reaction(input: {content: $content, subjectId: $subjectId}) {
      reaction {
        content
        id
      }
    }
  }`

export const toggleReaction = async (
  params: ToggleReactionBody,
  token: string,
  viewerHasReacted: boolean,
): Promise<ToggleReactionResponse> =>
  fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: TOGGLE_REACTION_QUERY(viewerHasReacted ? 'remove' : 'add'),
      variables: params,
    }),
  }).then((r) => r.json())
