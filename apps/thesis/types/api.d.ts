// ported from the great https://github.com/giscus/giscus

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

export interface Diff {
  commit1: string
  commit2: string
}

export interface CommitDatum {
  message: string
  y: number
  x: Date
  id: string
}

export type GitPerDate = {
  [date: string]: DateCommit
}

interface DateCommit {
  totalAdditions: number
  totalDeletions: number
  lastDate: number
  lastOid: string
  lastMessage: string
  commits: SubDateCommit[]
}

interface SubDateCommit {
  oid: string
  message: string
  date: number
  files: any[]
  additions: number
  deletions: number
}

export interface CSLCitation {
  id: string
  abstract?: string
  accessed?: Accessed
  ISBN?: string
  issued?: Issued
  language?: string
  note?: string
  publisher?: string
  source?: string
  title: string
  'title-short'?: string
  type: string
  URL?: string
  author?: Author[]
  'container-title'?: string
  DOI?: string
  ISSN?: string
  issue?: string
  page?: string
  volume?: string
  archive?: string
  'container-title-short'?: string
  genre?: string
  number?: string
  editor?: Editor[]
  'event-place'?: string
  'publisher-place'?: string
  'collection-title'?: string
  'call-number'?: string
  'number-of-pages'?: string
  section?: string
  edition?: string
  translator?: Editor[]
  'collection-number'?: string
  PMID?: string
  'reviewed-author'?: Editor[]
  medium?: string
  'collection-editor'?: Editor[]
}

interface Editor {
  family: string
  given: string
}

interface Author {
  family?: string
  given?: string
  literal?: string
  'non-dropping-particle'?: string
}

interface Issued {
  'date-parts'?: number[][]
  literal?: string
}

interface Accessed {
  'date-parts': number[][]
}

export interface DataProps {
  message: string
  y: number
  x: Date
  id: string
}
export interface AddsDels {
  id: string
  data: DataProps[]
}
export type CommitChartData = AddsDels[]
