const sortedPaths = ['a', 'a/b', 'a/b/c', 'b', 'b/a/c']
const red = sortedPaths.reduce((acc, curr) => {
  const splitPath = curr.split('/')
  if (splitPath.length === 1) {
    acc[splitPath] = {}
    return acc
  }
  const recursePath = (thing, splitPath) => {
    //  splitPath.forEach((path,index)=>{
    if (!splitPath?.length) {
      return thing
    }
    // console.log(splitPath)
    // console.log(thing)
    const fold = splitPath.shift()

    if (!thing?.[fold]) {
      thing[fold] = {}
    }

    return recursePath(thing[fold], splitPath)
  }

  recursePath(acc, splitPath)
  return acc
}, {})

// console.log(red)
