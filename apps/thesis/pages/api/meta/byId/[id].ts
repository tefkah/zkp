import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import { join } from 'path'
import { getFilesData, FilesData } from '../../../../utils/IDIndex/getFilesData'
import { DATA_DIR } from '../../../../utils/paths'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  if (Array.isArray(id)) {
    res.status(404)
    return
  }

  // const cwd = process.cwd()

  let data = {} as FilesData
  try {
    data = JSON.parse(await fs.readFile(join(DATA_DIR, 'dataById.json'), 'utf8'))
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

export default handler
