import { FilesData } from './IDIndex/getFilesData'

export const findCiteId = (cite: string, data: FilesData) => {
  const node = Object.values(data).find((n) => n.citation === cite)
  return node?.id || ''
}
export const findCiteTitle = (cite: string, data: FilesData) => {
  const node = Object.values(data).find((n) => n.citation === cite)
  //console.dir(data, { depth: null })
  return node?.title || ''
}
