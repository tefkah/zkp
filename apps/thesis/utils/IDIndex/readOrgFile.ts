import { readFile } from 'fs/promises'
import path from 'path'

export const readOrgFile = async (file: string) => {
  const cwd = process.cwd()
  const dir = path.resolve(cwd, 'notes')
  const filepath = path.join(dir, file)
  try {
    const text = await readFile(filepath, { encoding: 'utf8' })
    return text
  } catch (e) {
    console.error(e)
    return ''
  }
}
