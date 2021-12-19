export const nearestMilestone = `{
  repository(name: "thesis-writing", owner: "ThomasFKJorna") {
    milestones(orderBy: {field: DUE_DATE, direction: ASC}, first: 1) {
      edges {
        cursor
        node {
          dueOn
          id
          progressPercentage
          updatedAt
          title
          state
          description
          number
          url
        }
      }
    }
  }
}`

export const issuesPerMilestone = (props: {
  milestoneNumber: string
  cursor: string
  first: string
}) => `{
  repository(name: "thesis-writing", owner: "ThomasFKJorna") {
    milestone(number: ${props.milestoneNumber}) {
      issues(first: ${props.first} ${props.cursor ? `after: ${props.cursor}` : ''}) {
        edges {
          cursor
          node {
            id
            closed
            number
            title
            url
            updatedAt
            body
          }
        }
      }
    }
  }
}`
