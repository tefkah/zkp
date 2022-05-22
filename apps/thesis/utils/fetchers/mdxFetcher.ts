// import { mdxSerialize } from '../mdx/mdxSerialize'
// import { BIB_URL } from '../paths'

export const mdxFetcher = (slug: string) =>
  fetch(`/api/file/bySlug/${slug.replace('/', '')}`)
    .then((res) => res.json())
    // .then((res) => mdxSerialize(res, BIB_URL))
    .then((res) => res)
    .catch((e) => {
      console.error(e)
    })
