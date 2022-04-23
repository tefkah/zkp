import { parseGitRepo } from './parseGitRepo'

describe('parseGitRepo', () => {
  it('should parse repo', async () => {
    const repo = await parseGitRepo(
      'https://github.com/ThomasFKJorna/thesis-writing',
      'notes',
      'notes/git',
    )
    expect(repo).toBeDefined()
  })
  /*   it('should do something with diff', async () => {
    const repo = await parseGitRepo(
      'https://github.com/ThomasFKJorna/thesis-writing',
      'notes',
      'notes/git',
    )
    const diffs = repo.map((c) => {
      // console.log(c.commit)
      if (c.files.type === 'equal') {
        return
      }
      const f = c.files
      return f.map((o: any) => {
        return o.diff
          .map((d: any) => {
            const type = d.added ? '+++' : d.removed ? '---' : ''
            return `${type}${d.value}${type}`
          })
          .join('')
      })
    })
    console.log(diffs)
    expect(diffs).toBeDefined()
  }) */
})
