const sortedPaths=['q', 'a', 'a/b', 'a/b/c', 'b', 'b/a/c' ]
const red = sortedPaths.reduce((acc, curr)=> {
const splitPath = curr.split('/')

const recursePath = (thing, splitPath) => {
 if(!splitPath?.length){return thing}
 const fold = splitPath.shift()

const index = thing.children.findIndex(child => child.name === fold)
 if((index <0) && thing.name !== fold){
   console.log(`Could not find ${fold} in the children of ${JSON.stringify(thing)}, as findIndex returned ${index}`)
    thing.children.push({type:'folder',name:fold,children:[]})
 return recursePath(thing.children.at(-1),splitPath)
 }

 return recursePath(thing.children[index],splitPath)
}

recursePath(acc, splitPath)
return acc
},{type:'folder',name:'root',children:[]})

 
console.dir(red,{depth:null})

