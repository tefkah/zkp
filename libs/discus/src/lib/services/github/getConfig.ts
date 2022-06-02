// ported from the great https://github.com/giscus/giscus

import { IRepoConfig } from '@zkp/types'
import { getJSONFile } from './getFile'

export const getRepoConfig = async (repoWithOwner: string, token?: string) => {
  try {
    return await getJSONFile<IRepoConfig>(repoWithOwner, 'giscus.json', token)
  } catch (err) {
    return {}
  }
}
