import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()
import {fetchDiff} from './github'

describe('fetch', ()=>{
  beforeEach(() => {
    fetch.resetMocks()
  })
    const commit1 = "8320626cdf6d0a9829e10197499e2944c64317c2"
    const commit2 = "e80eb3ca9e9c20d24b153a3e45b33ed1b816d9d8"
    const repo ="org-roam/org-roam-ui/"
    it('fetches diffs between 2 commits', async ()=>{
    fetch.mockResponseOnce(JSON.stringify({ data: '12345' }))
        expect(fetchDiff(repo, commit1,commit2)).toBeDefined()
    })
})