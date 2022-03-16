import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import { join } from 'path'
import getFilesData, { FilesData } from '../../../../utils/IDIndex/getFilesData'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (Array.isArray(id)) {
    res.status(404)
    return
  }

  //const { file } = props.params
  const cwd = process.cwd()

  let data = {} as FilesData
  try {
    data = JSON.parse(await fs.readFile(join(cwd, 'data', 'dataById.json'), 'utf8'))
  } catch (err) {
    console.warn('No existing filedata found, generating...')
    data = await getFilesData()
  }
  req.statusCode = 200
  const meta = data?.[id]

  if (!meta) {
    res.status(404)
    return
  }

  res.json({ meta })
}
