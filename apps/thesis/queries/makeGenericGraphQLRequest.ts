export default async function makeGenericGraphQlRequest(props: {
  request: string
  token: string
  post?: boolean
  endpoint?: string
}) {
  const { request, endpoint, token, post } = props

  return fetch(`${endpoint || 'https://api.github.com/graphql'}`, {
    method: post ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: request }),
  })
    .then((res) => res.json())
    .then((res) => res)
    .catch((e) => {
      console.error(e)
      return { error: e }
    })
}
