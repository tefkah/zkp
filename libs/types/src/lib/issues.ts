export interface MilestoneNode {
  dueOn: string
  id: string
  progressPercentage: string
  updatedAt: string
  title: string
  state: string
  description: string
  number: number
  url: string
  issues: Issues
}
export interface NearestMilestoneData {
  data: {
    repository: {
      milestones: {
        edges: [
          {
            cursor: string
            node: MilestoneNode
          },
        ]
      }
    }
  }
}
export interface Edge {
  cursor: string
  node: Issue
}
export interface Issue {
  id: string
  closed: boolean
  number: number
  title: string
  url: string
  updatedAt: string
  body: string
  labels: Labels
}
export interface Issues {
  edges: Edge[]
}

export interface Labels {
  nodes: LabelNode[]
}

export interface LabelNode {
  color: string
  name: string
  description: string
}
