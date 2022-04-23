// ported from the great https://github.com/giscus/giscus

import { Reaction } from '../../types/github'

const TOGGLE_REACTION_QUERY = (mode: 'add' | 'remove') => `
  mutation($content: ReactionContent!, $subjectId: ID!) {
    toggleReaction: ${mode}Reaction(input: {content: $content, subjectId: $subjectId}) {
      reaction {
        content
        id
      }
    }
  }`

export interface ToggleReactionBody {
  content: Reaction
  subjectId: string
}

export interface ToggleReactionResponse {
  data: {
    toggleReaction: {
      reaction: {
        content: Reaction
        id: string
      }
    }
  }
}

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
