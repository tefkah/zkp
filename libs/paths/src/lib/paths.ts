import { join } from 'path'

const cwd = process.cwd()

export const APP_DIR = join(
  cwd,
  ...(process.env.CURRENT_FOLDER ? [process.env.CURRENT_FOLDER] : ['apps', 'thesis']),
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

export const BIB_URL = `${
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PROD_URL
    : process.env.NEXT_PUBLIC_LOCAL_URL
}/${join(
  process.env.NEXT_PUBLIC_NOTE_DIR?.replace('public/', '') || 'notes',
)}/.bibliography/Academic.bib`

export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PROD_URL
    : process.env.NEXT_PUBLIC_REPO_URL

export const REMOTE = process.env.REMOTE || 'https://github.com/thomasfkjorna/thesis-writing'

// console.log(BIB_URL)
