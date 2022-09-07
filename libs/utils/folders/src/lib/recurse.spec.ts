import { u } from 'unist-builder'
import { fileListReducer } from './recurse'
import { red } from './baby'

// const sortedPathsObj = [
//   { folders: ['q'] },
//   { folders: ['a'] },
//   { folders: ['a', 'b'] },
//   { folders: ['a', 'b', 'c'] },
//   { folders: ['b'] },
//   { folders: ['b', 'a', 'c'] },
// ]

const realisticTestObj = [
  { folders: ['QLastTopFolder'], name: 'qfile', slug: 'qfile' },
  { folders: ['AFirstTopFolder', 'bFolder', 'cFolder'], name: 'abcfile', slug: 'abcfile' },
  { folders: ['AFirstTopFolder'], name: 'afile', slug: 'afile' },
  { folders: ['AFirstTopFolder', 'bFolder'], name: 'abfile', slug: 'abfile' },
  { folders: ['BSecondTopFolder', 'aFolder', 'cFolder'], name: 'bacfile', slug: 'bacfile' },
  { folders: ['BSecondTopFolder'], name: 'bfile', slug: 'bfile' },
]
const sortedPaths = ['q', 'a', 'a/b', 'a/b/c', 'b', 'b/a/c']

const objToFile = ({ name, slug }: typeof realisticTestObj[number]) => ({
  name,
  slug,
  type: 'file',
})

const genChildren = (index: number, elements: number, obj = realisticTestObj) =>
  new Array(elements).fill(objToFile(obj[index]), 0, elements)

const folderTreeWithFiles = (elements: number) =>
  u('folder', { name: 'root' }, [
    u('folder', { name: 'AFirstTopFolder' }, [
      u('folder', { name: 'bFolder' }, [
        u('folder', { name: 'cFolder' }, genChildren(1, elements)),
        ...genChildren(3, elements),
      ]),
      ...genChildren(2, elements),
    ]),
    u('folder', { name: 'BSecondTopFolder' }, [
      u('folder', { name: 'aFolder' }, [
        u('folder', { name: 'cFolder' }, genChildren(4, elements)),
      ]),
      ...genChildren(5, elements),
    ]),
    u('folder', { name: 'QLastTopFolder' }, genChildren(0, elements)),
  ])

const folderTree = u('folder', { name: 'root' }, [
  u('folder', { name: 'q' }, []),
  u('folder', { name: 'a' }, [u('folder', { name: 'b' }, [u('folder', { name: 'c' }, [])])]),
  u('folder', { name: 'b' }, [u('folder', { name: 'a' }, [u('folder', { name: 'c' }, [])])]),
])

describe('recurse', () => {
  it('should work for plain folders', () => {
    expect(red(sortedPaths)).toEqual(folderTree)
  })
})

describe('realistic recursion test', () => {
  it('should work with a realistic obj', () => {
    const res = fileListReducer(JSON.parse(JSON.stringify(realisticTestObj)))
    expect(res).toEqual(folderTreeWithFiles(1))
  })
  it('should not create more folders when there are duplicates', () => {
    const double = [
      ...JSON.parse(JSON.stringify(realisticTestObj)),
      ...JSON.parse(JSON.stringify(realisticTestObj)),
    ]
    expect(fileListReducer(JSON.parse(JSON.stringify(double)))).toEqual(folderTreeWithFiles(2))
  })
})
