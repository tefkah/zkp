// ported from the great https://github.com/giscus/giscus

import { IRepoConfig } from '../../types/giscus'
import { getJSONFile } from './getFile'

export const getRepoConfig = async (repoWithOwner: string, token?: string) => {
  try {
    return await getJSONFile<IRepoConfig>(repoWithOwner, 'giscus.json', token)
  } catch (err) {
    return {}
  }
}
