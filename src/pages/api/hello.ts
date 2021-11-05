const query = (req: any, res: any) => {
  const { name = 'World' } = req.query
  res.status(200).send(`Hello ${name}!`)
}

export default query
