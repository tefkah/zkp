import { getListOfCommitsWithStats } from './getListOfCommitsWithStats'

const firstCommit = '8a8d96b1a6ae75dd17f7462c31695823189f6f14'
const lastCommit = '635c1974031c9ba51e275c308ac38617bd8b5b46'
describe('getListOfCommitsWithStats', () => {
  jest.setTimeout(200000)
  it('gets a list', async () => {
    const list = await getListOfCommitsWithStats(firstCommit, lastCommit)
    expect(list).toBeDefined()
  })
})
