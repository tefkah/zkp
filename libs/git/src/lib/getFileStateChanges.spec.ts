import { WalkerEntry } from 'isomorphic-git'
import { getFileStateChanges, doSomethingAtFileStateChange } from './getFileStateChanges'

describe('getFileStateChanges', () => {
  it('find modifications', async () => {
    const [commit1, commit2] = [
      '4cb1dd47256b7f9947af03c82672c567173003d1',
      '635c1974031c9ba51e275c308ac38617bd8b5b46',
    ]
    const status = await getFileStateChanges(commit1, commit2)
    const changed = status.filter((f: any) => f.type !== 'equal')
    console.log(changed)
    expect(changed).toEqual([{ path: '/.github/workflows/vercel.yml', type: 'modify' }])
  })
  it('finds additions', async () => {
    const [commit1, commit2] = [
      '8461be36d0560a8210893f36f81bb2157a37b22f',
      '59b4d09776cd1ad293bf9a6b6f864bc81603bbc2',
    ]

    const status = await getFileStateChanges(commit1, commit2)
    const changed = status.filter((f: any) => f.type !== 'equal')
    expect(changed).toEqual([{ path: '/.github/workflows/vercel.yml', type: 'add' }])
  })
  it('finds everything', async () => {
    const [commit1, commit2] = [
      '8a8d96b1a6ae75dd17f7462c31695823189f6f14',
      '635c1974031c9ba51e275c308ac38617bd8b5b46',
    ]
    const list = (await getFileStateChanges(commit1, commit2)).filter(
      (f: any) => f.type !== 'equal',
    )
    expect(list).toBeDefined()
  })
})

describe('doSomethingAtFileStateChange', () => {
  it('does anything at all', async () => {
    const [commit1, commit2] = [
      '8461be36d0560a8210893f36f81bb2157a37b22f',
      '59b4d09776cd1ad293bf9a6b6f864bc81603bbc2',
    ]
    const x = await doSomethingAtFileStateChange(
      commit1,
      commit2,
      undefined,
      undefined,
      async (filepath: string, trees: Array<WalkerEntry | null>, type?: string) => {
        if (type === 'equal') {
          return
        }
        const [tree1, tree2] = trees
        //  if (!tree1 || !tree2) {
        //    return
        //  }
        if ((await tree1?.type()) === 'tree' || (await tree2?.type()) === 'tree') {
          return
        }

        const t1Content = (await tree1?.content()) || []
        const t2Content = (await tree2?.content()) || []
        const t1Buffer = Buffer.from(t1Content)
        const t2Buffer = Buffer.from(t2Content)
        const t1String = t1Buffer.toString('utf8')
        const t2String = t2Buffer.toString('utf8')
        return { aaa: t1String, bbb: t2String }
      },
    )
    expect(x).toBeDefined()
  })
})
