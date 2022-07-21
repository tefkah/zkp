import { join } from 'path'
import { config } from 'dotenv'

const cwd = process.cwd()
console.log(process.env.NODE_ENV)
process.env.NODE_ENV !== 'production' && config({ path: join(cwd, '../../../../.env') })

console.log(process.env.CURRENT_FOLDER)
export const APP_DIR = join(
  cwd,
  ...(process.env.CURRENT_FOLDER ? [process.env.CURRENT_FOLDER] : ['apps', 'zkp']),
)
// console.log(APP_DIR)
export const NEXT_PUBLIC_NOTE_DIR = join(
  APP_DIR,
  process.env.NEXT_PUBLIC_NOTE_DIR ?? 'public/notes',
)
// console.log(NEXT_PUBLIC_NOTE_DIR)

export const GIT_DIR = join(NEXT_PUBLIC_NOTE_DIR, 'git')
// console.log(GIT_DIR)
export const DATA_DIR = join(APP_DIR, process.env.DATA_DIR ?? 'public/data')

export const BIB_PATH = process.env.BIB_PATH
  ? join(APP_DIR, process.env.BIB_PATH)
  : join(NEXT_PUBLIC_NOTE_DIR, '.bibliography', 'Academic.bib')

// console.log(BIB_URL)

export * from './urls'
