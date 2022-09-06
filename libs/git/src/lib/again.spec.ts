import { WalkerEntry } from 'isomorphic-git'
import { doSomethingAtFileStateChange } from './doSomethingAtFileStateChanges'

it('does anything at all', async () => {
  const [commit1, commit2] = ['8461be36d0560a8210893f36f81bb2157a37b22f', 'HEAD']
  const x = await doSomethingAtFileStateChange(
    {
      commitHash1: commit1,
      // commit2,
    },
    // async (filepath: string, trees: Array<WalkerEntry | null>, type?: string) => {
    //   if (type === 'equal') {
    //     return
    //   }
    //   // const [tree1, tree2] = trees;
    //   // //  if (!tree1 || !tree2) {
    //   // //    return
    //   // //  }
    //   // if ((await tree1?.type()) === "tree" || (await tree2?.type()) === "tree") {
    //   //   return;
    //   // }

    //   // const t1Content = (await tree1?.content()) || [];
    //   // const t2Content = (await tree2?.content()) || [];
    //   // console.log(filepath, trees, type)
    //   return { hey: type }
    // },
  )
  console.log(x)
  expect(x).toBeDefined()
})

it('does something only at a specific file', async () => {
  const e = await doSomethingAtFileStateChange({
    commitHash1: '8461be36d0560a8210893f36f81bb2157a37b22f',
    filename: 'topology.(mdx?|org)',
    fileStateFun: async (filepath: string, trees: [WalkerEntry, WalkerEntry], type?: string) => {
      const res = { filepath, 0: trees[0].content(), 1: trees[1].content() }
      console.log(res)
      return res
    },
  })
  console.log(e)
  expect(e).toBeDefined()
})
