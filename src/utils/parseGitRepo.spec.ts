import parseGitRepo from './parseGitRepo'

describe('parseGitRepo', () => {
  it('should parse repo', async () => {
    const repo = await parseGitRepo('https://github.com/ThomasFKJorna/thesis-writings', 'test')
    repo.map((c) => {
      // console.log(c.commit)
      if (c.files.type === 'equal') {
        return
      }
      console.log(c.files)
    })
    expect(repo).toBeDefined()
  })
})
