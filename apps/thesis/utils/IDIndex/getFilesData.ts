/* eslint-disable no-await-in-loop */
import { resolve } from 'path'
import readdirp from 'readdirp'
import { getDataFromFile, OrgFileData } from './getDataFromFile'
import { readOrgFile } from './readOrgFile'

export interface FilesData {
  [file: string]: OrgFileData
}
export const getFilesData = async (by?: 'id' | 'title' | 'cite') => {
  const cwd = process.cwd()
  const dataDir = resolve(cwd, 'notes')
  const files = await readdirp.promise(dataDir, {
    type: 'files',
    fileFilter: ['!README.org', '*.org'],
  })

  const fileData = {} as FilesData
  // eslint-disable-next-line no-restricted-syntax
  for (const entry of files) {
    const { path } = entry

    const file = await readOrgFile(path)

    const data = await getDataFromFile(file)

    fileData[data.id] = { ...data, path }
  }

  Object.entries(fileData).forEach((entry) => {
    const [id, obj] = entry

    const links = [...(obj.forwardLinks ?? []), ...(obj.citations ?? [])]
    links.forEach((link) => {
      if (fileData[link]) {
        fileData[link].backLinks = [...(fileData[link].backLinks ?? []), id]
      }
    })
  })

  switch (by) {
    case 'title': {
      return Object.values(fileData).reduce((acc, curr) => {
        acc[curr.title] = curr
        return acc
      }, {} as FilesData)
    }
    case 'cite':
      return Object.values(fileData).reduce((acc, curr) => {
        if (!curr.citation) return acc
        acc[curr.citation] = curr
        return acc
      }, {} as FilesData)
    case 'id':
    default:
      return fileData
  }
}
