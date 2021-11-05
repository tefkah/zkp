export default function handler(req: any, res: any) {
  const { slug } = req
  if (slug.length < 2) {
    res.end(`Post: Error, api is like compare/commit1/commit2.`)
  }
  const [commit1, commit2] = slug
  res.end(`Post: ${commit1} is earlier then ${commit2}`)
}
