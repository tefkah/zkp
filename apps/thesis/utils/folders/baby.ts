import { RecursiveFolder } from '.'

export const recursePathPlain = (thing: RecursiveFolder, splitPath: string[]): RecursiveFolder => {
  if (!splitPath?.length) {
    return thing
  }
  const fold = splitPath.shift()

  const index = thing.children.findIndex((child) => child.name === fold)
  if (index < 0 && thing.name !== fold) {
    // console.log(
    // `Could not find ${fold} in the children of ${JSON.stringify(
    // thing,
    // )}, as findIndex returned ${index}`,
    // )
    thing.children.push({ type: 'folder', name: fold, children: [] })

    return recursePathPlain(thing.children.at(-1), splitPath)
  }

  return recursePathPlain(thing.children[index], splitPath)
}

export const red = (paths: string[]) =>
  paths.reduce(
    (acc: RecursiveFolder, curr) => {
      const splitPath = curr.split('/')

      recursePathPlain(acc, splitPath)
      return acc
    },
    { type: 'folder', name: 'root', children: [] } as RecursiveFolder,
  )
