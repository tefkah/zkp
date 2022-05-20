import { mdxSerialize } from '../mdx/mdxSerialize'
import { BIB_URL } from '../paths'

export const mdxFetcher = (url: string) =>
  fetch(url)
    .then((res) => res.text())
    .then((res) => mdxSerialize(res, BIB_URL))
    .then((res) => res)
    .catch((e) => {
      console.error(e)
    })
