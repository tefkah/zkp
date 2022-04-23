export interface StackState {
  obstructed: boolean
  highlighted: boolean
  overlay: boolean
  active: boolean
  /**
   * Mostly because object order is not guaranteed
   */
  index: number
}

export interface StackedNotesState {
  [id: string]: StackState
}

export interface File {
  path: string
  type: 'file'
  id: string
}
export interface Files {
  files: File[]
  folders: { [key: string]: File[] }
}
export interface NoteHeading {
  level: string
  text: string
  id: string
}
