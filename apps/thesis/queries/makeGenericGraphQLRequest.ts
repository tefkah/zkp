export const makeGenericGraphQlRequest = async (props: {
  request: string
  token: string
  post?: boolean
  endpoint?: string
}) => {
  const { request, endpoint, token, post } = props

  try {
    const res = await fetch(`${endpoint || 'https://api.github.com/graphql'}`, {
      method: post ? 'POST' : 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: request }),
    })
    const res1 = await res.json()
    return res1
  } catch (e) {
    console.error(e)
    return { error: e }
  }
}
