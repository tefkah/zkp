import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { CommitPerDateLog } from '../api.js'
import { NoteHeading } from '../notes.js'

/**
 * Props for the file page
 */
export type FilePageProps = {
  /**
   * The source for the current page
   */
  source: MDXRemoteSerializeResult
  /**
   * The metadata for the current file
   */
  // fileData: OrgFileData
  /**
   * Array with the ids of the stacked notes
   */
  stackedNotes?: string[]
  /**
   * Object containing all info of all files by id
   */
  id: string
  /**
   * Array of headings of the current document
   */
  toc: NoteHeading[]
  commits: CommitPerDateLog
}
