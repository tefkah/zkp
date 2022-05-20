import axios from 'axios'

export const fetcher = async (resource: string, init?: { [key: string]: string | number }) =>
  axios.get(resource, init).then((res) => res.data)
