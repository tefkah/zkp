export interface Root {
  type: 'root'
  children: RecursiveFolder[]
  previouslySeenFolders: string[]
}

export interface RecursiveFolder {
  name: string
  type: 'folder'
  children: (RecursiveFolder | FileLeaf)[]
}

export interface FileLeaf {
  type: 'file'
  name: string
  slug: string
}
