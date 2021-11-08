import { getFileStateChangesDoc } from './getFileStateChanges'

describe('getChangedFiles', () => {
  it('find modifications', async () => {
    const [commit1, commit2] = [
      '4cb1dd47256b7f9947af03c82672c567173003d1',
      '635c1974031c9ba51e275c308ac38617bd8b5b46',
    ]
    const status = await getFileStateChangesDoc(commit1, commit2, 'notes', 'notes/git')
    const changed = status.filter((f: any) => f.type !== 'equal')
    expect(changed).toEqual([{ path: '/.github/workflows/vercel.yml', type: 'modify' }])
  })
  it('finds additions', async () => {
    const [commit1, commit2] = [
      '8461be36d0560a8210893f36f81bb2157a37b22f',
      '59b4d09776cd1ad293bf9a6b6f864bc81603bbc2',
    ]

    const status = await getFileStateChangesDoc(commit1, commit2, 'notes', 'notes/git')
    const changed = status.filter((f: any) => f.type !== 'equal')
    expect(changed).toEqual([{ path: '/.github/workflows/vercel.yml', type: 'add' }])
  })
})
