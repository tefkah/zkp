import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import { join } from 'path'
import { getFilesData, FilesData } from '../../../../utils/IDIndex/getFilesData'
import { NEXT_PUBLIC_NOTE_DIR } from '../../../../utils/paths'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title } = req.query
  if (Array.isArray(title) || !title) {
    res.status(404)
    return
  }

  // const { file } = props.params
  const cwd = process.cwd()

  let data = {} as FilesData
  try {
    data = JSON.parse(await fs.readFile(join(cwd, 'data', 'dataByTitle.json'), 'utf8'))
  } catch (err) {
    console.warn('No existing filedata found, generating...')
    data = await getFilesData()
  }
  const path = data?.[title].path

  if (!path) {
    res.status(404)
    return
  }
  try {
    const file = await fs.readFile(join(NEXT_PUBLIC_NOTE_DIR, path), 'utf8')
    res.status(200)
    res.json({ file })
  } catch (err) {
    res.status(500)
    res.json({ err })
  }
}

export default handler
