import { lstat, readdir } from 'fs/promises'
import { resolve } from 'path'
import unified from 'unified'
import { getDataFromFile, OrgFileData } from './getDataFromFile'
import { readOrgFile } from './readOrgFile'
import readdirp from 'readdirp'

export interface FilesData {
  [file: string]: OrgFileData
}
export default async function getFilesData() {
  const cwd = process.cwd()
  const dataDir = resolve(cwd, 'notes')
  const files = await readdirp.promise(dataDir, {
    type: 'files',
    fileFilter: ['!README.org', '*.org'],
  })

  const fileData = {} as FilesData
  for (const entry of files) {
    const { path } = entry

    const file = await readOrgFile(path)

    const data = await getDataFromFile(file)

    fileData[data.id] = { ...data, path }
  }

  Object.entries(fileData).forEach((entry) => {
    const [id, obj] = entry

    const links = [...(obj.forwardLinks ?? []), ...(obj.citations ?? [])]
    links.forEach(
      (link) =>
        fileData[link] && (fileData[link].backLinks = [...(fileData[link].backLinks ?? []), id]),
    )
  })

  return fileData
}
