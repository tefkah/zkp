import { CompareFn, FileLeaf, NextJSCompatibleStats, RecursiveFolder } from '../../types'

export interface SortFuncArgs {
  /**
   * A comparison function to decide sort order between files.
   *
   * @default Alphabetical
   */
  compareFn: FileCompareFn
  /**
   * A comparison function to decide sort order between folders.
   * by default it will try to use the same function used to compare files,
   * if that fails it will fallback to alphabetical sort.
   *
   * @default compareFn
   */
  folderCompareFn: CompareFn
  /**
   * Whether to reverse the sort function results, e.g. sorting from Z-A when given an alphabetical sort.
   *
   * @default false
   */
  reverse: boolean
  /**
   * Determines how folders are sorted wrt files. Takes either
   * - 'first': folders will always be places higher than files
   * - 'last': folders will always be placed lower than files
   * - a `CompareFn` function which compares folders to files
   *
   * @default 'first'
   */
  folderPriority: 'first' | 'last' | CompareFn
}

const localeCompare: CompareFn = (a, b) => a.name.localeCompare(b.name)
export type FolderCompareFn = (a: RecursiveFolder, b: RecursiveFolder) => number
export type FileCompareFn = (a: FileLeaf, b: FileLeaf) => number

export const createSortFunc = ({
  compareFn = localeCompare,
  // @ts-expect-error I know but I'll try anyway
  folderCompareFn = compareFn,
  reverse = false,
  folderPriority = 'first',
}: SortFuncArgs): CompareFn => {
  const sign = reverse ? -1 : 1

  const comp: CompareFn = (a, b) => {
    if (a.type === b.type) {
      if (a.type === 'folder' || b.type === 'folder') {
        try {
          return sign * folderCompareFn(a, b)
        } catch (e) {
          console.warn(
            'File comparison function could not be applied to folders, defaulting to alphabetical sort.',
          )
          return sign * localeCompare(a, b)
        }
      }

      return sign * compareFn(a, b)
    }

    /**
     * When a function is given to determine the priority of folders,
     * use that
     */
    if (typeof folderPriority !== 'string') {
      return folderPriority(a, b)
    }

    const folderPrioritySign = folderPriority === 'last' ? -1 : 1

    return folderPrioritySign * (a.type === 'folder' ? -Infinity : Infinity)
  }
  return comp
}

/**
 * Return both the normal and reversed function of the sort func in an array.
 */
export const createSortFunctions = (
  {
    compareFn = localeCompare,
    // @ts-expect-error I know but I'll try anyway
    folderCompareFn = compareFn,
    folderPriority = 'first',
  }: Omit<SortFuncArgs, 'reverse'> = {
    // compareFn: localeCompare,
    // folderCompareFn: compareFn,
    // folderPriority: 'first',
  } as Omit<SortFuncArgs, 'reverse'>,
): [CompareFn, CompareFn] => [
  createSortFunc({ compareFn, folderCompareFn, folderPriority, reverse: false }),
  createSortFunc({ compareFn, folderCompareFn, folderPriority, reverse: true }),
]

const createStatCompare =
  (stats: keyof NextJSCompatibleStats): FileCompareFn =>
  (a: FileLeaf, b: FileLeaf) =>
    a.stats[stats] - b.stats[stats]

const createComp = createStatCompare('ctimeMs')
const modComp = createStatCompare('mtimeMs')
// const aComp = createStatCompare('atimeMs')

export const [defaultSort, reverseAlpha] = createSortFunctions()

export const [createdSort, reverseCreatedSort] = createSortFunctions({
  compareFn: createComp,
  folderCompareFn: localeCompare,
  folderPriority: 'first',
})

export const [modSort, reverseModSort] = createSortFunctions({
  compareFn: modComp,
  folderCompareFn: localeCompare,
  folderPriority: 'first',
})

export const sorts = {
  alpha: defaultSort,
  reverseAlpha,
  created: createdSort,
  reverseCreated: reverseCreatedSort,
  modified: modSort,
  reverseModified: reverseModSort,
}
