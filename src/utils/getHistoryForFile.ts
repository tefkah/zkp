import { SlimCommit } from '../lib/api'
import { consolidateCommitsPerDay } from './getListOfCommitsWithStats'

export interface FileHistory {
  file: string
  commits: SlimCommit[]
  aliases?: string[]
}
export default function getHistoryForFile(props: FileHistory) {
  const { file, commits, aliases } = props
  const newData = commits.reduce((acc: SlimCommit[], curr) => {
    if (!curr.files.some((f) => f.includes(file.replace(/.*?\//g, '')))) return acc

    acc.push(curr)
    return acc
  }, [])
  return consolidateCommitsPerDay(newData)
}
