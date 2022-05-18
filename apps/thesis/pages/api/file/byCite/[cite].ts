import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import { join } from 'path'
import { getFilesData, FilesData } from '../../../../utils/IDIndex/getFilesData'
import { NOTE_DIR } from '../../../../utils/paths'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { cite } = req.query
  if (Array.isArray(cite)) {
    res.status(404)
    return
  }

  // const { file } = props.params
  const cwd = process.cwd()

  let data = {} as FilesData
  try {
    data = JSON.parse(await fs.readFile(join(cwd, 'data', 'dataByCite.json'), 'utf8'))
  } catch (err) {
    console.warn('No existing filedata found, generating...')
    data = await getFilesData()
  }
  req.statusCode = 200

  const path = data?.[cite].path

  if (!path) {
    res.status(404)
    return
  }
  const file = await fs.readFile(join(NOTE_DIR, path), 'utf8')
  res.json({ file })
}

export default handler
