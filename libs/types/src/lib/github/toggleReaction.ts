import { Reaction } from './githubGiscus.js'

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
