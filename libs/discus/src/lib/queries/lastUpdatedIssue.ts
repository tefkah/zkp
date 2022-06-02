export const lastUpdatedIssue = `{
  repository(name: "thesis-writing", owner: "ThomasFKJorna") {
    issues(orderBy: {field: UPDATED_AT, direction: DESC}, first: 1) {
      edges {
        node {
          id
          title
          updatedAt
          body
          url
        }
      }
    }
  }
}`

export const paginatedIssues = `{
  repository(name: "thesis-writing", owner: "ThomasFKJorna") {
    issues(orderBy: {field: UPDATED_AT, direction: DESC}, first: 10) {
      edges {
        node {
          id
          title
          updatedAt
          body
          url
        }
        cursor
      }
    }
  }
}`
