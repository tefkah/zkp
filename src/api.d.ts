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

export interface SlimCommit {
  oid: string
  message: string
  date: number
  additions: number
  deletions: number
  files: any[]
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

export interface CommitPerDateLog {
  [date: string]: DateCommit
}

interface DateCommit {
  totalAdditions: number
  totalDeletions: number
  totalDate: number
  lastMessage: string
  lastOid: string
  commits: SlimCommit[]
}
