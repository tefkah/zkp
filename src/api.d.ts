export interface GitLogCommit {
  oid: string
  commit: SubCommit
  payload: string
}

export interface GitLogSubCommit {
  message: string
  parent: string[]
  tree: string
  author: Author
  committer: Author
}

export interface GitLogAuthor {
  name: string
  email: string
  timestamp: number
  timezoneOffset: number
}

export interface Commit {
  message: string
  date: number
  files: FileDiff[]
  additions: number
  deletions: number
  oid: string
}

export type FileDiff =
  | {
      filepath: string
      oid: string
      diff: Changes[]
      additions: number
      deletions: number
    }
  | undefined
