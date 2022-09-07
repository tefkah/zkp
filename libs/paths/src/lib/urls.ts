export const BIB_URL = `${
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PROD_URL
    : process.env.NEXT_PUBLIC_LOCAL_URL
}/${process.env.NEXT_PUBLIC_NOTE_DIR?.replace('public/', '') || 'notes'}/.bibliography/Academic.bib`

export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PROD_URL
    : process.env.NEXT_PUBLIC_REPO_URL

export const REMOTE = process.env.REMOTE || 'https://github.com/thomasfkjorna/thesis-writing'
