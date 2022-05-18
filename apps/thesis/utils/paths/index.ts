import { join } from 'path'

const cwd = process.cwd()

export const APP_DIR = join(
  cwd,
  ...(process.env.CURRENT_FOLDER ? [process.env.CURRENT_FOLDER] : ['apps', 'thesis']),
)
console.log(APP_DIR)
export const NOTE_DIR = join(APP_DIR, process.env.NOTE_DIR ?? 'notes')
console.log(NOTE_DIR)

export const GIT_DIR = join(NOTE_DIR, 'git')
console.log(GIT_DIR)
export const DATA_DIR = join(APP_DIR, process.env.DATA_DIR ?? 'data')

export const BIB_PATH = join(
  APP_DIR,
  ...(process.env.BIB_PATH ? [process.env.BIB_PATH] : ['notes', '.bibliography', 'Academic.bib']),
)
