export interface DiscussionList {
  data: Data
}

interface Data {
  repository: Repository
}

interface Repository {
  discussions: Discussions
}

interface Discussions {
  edges: DiscussionEdge[]
}

export interface DiscussionEdge {
  cursor: string
  node: DiscussionNode
}

export interface DiscussionNode {
  body: string
  title: string
  updatedAt: string
  category: Category
  author: Author
  comments: Comments
}
interface Comments {
  totalCount: number
  edges: CommentEdge[]
}

export interface CommentEdge {
  node: CommentNode
}

interface CommentNode {
  replies: Replies
}
interface Replies {
  totalCount: number
}

interface Author {
  avatarUrl: string
  login: string
  url: string
}

interface Category {
  name: string
  description: string
  emojiHTML: string
}

export interface CategoryData {
  data: Data
}

interface Data {
  repository: Repository
}

interface Repository {
  discussionCategories: DiscussionCategories
}

interface DiscussionCategories {
  nodes: Node[]
}

interface Node {
  emoji: string
  emojiHTML: string
  id: string
  name: string
  description: string
}
