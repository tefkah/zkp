import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import { join } from 'path'
import { getFilesData, FilesData } from '../../../../utils/IDIndex/getFilesData'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  if (Array.isArray(id)) {
    res.status(404)
    return
  }

  const cwd = process.cwd()

  let data = {} as FilesData
  try {
    data = JSON.parse(await fs.readFile(join(cwd, 'data', 'dataById.json'), 'utf8'))
  } catch (err) {
    console.warn('No existing filedata found, generating...')
    data = await getFilesData()
  }
  const path = data?.[id].path

  if (!path) {
    res.status(404)
    return
  }
  try {
    const file = await fs.readFile(join(cwd, 'notes', path), 'utf8')
    res.status(200)
    res.json({ file })
  } catch (err) {
    res.status(500)
    res.json({ err })
  }
}

export default handler
