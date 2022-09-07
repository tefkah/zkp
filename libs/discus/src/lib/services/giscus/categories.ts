// ported from the great https://github.com/giscus/giscus

// from Giscus

import { ICategories, IError } from '@zkp/types'

export const getCategories = async (repo: string) => {
  const result: ICategories | IError = await fetch(
    `/api/discussions/categories?${new URLSearchParams({ repo })}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then((r) => r.json())

  if ('error' in result) throw new Error(result.error)

  const { repositoryId, categories } = result
  if (!(repositoryId && categories.length)) throw new Error('Unable to fetch discussion categories')

  return result
}
