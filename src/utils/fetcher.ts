import axios from 'axios'

export default async function fetcher(resource: string, init?: { [key: string]: string | number }) {
  return axios.get(resource, init).then((res) => res.data)
}
