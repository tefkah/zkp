import axios from 'axios'
//const BASE_URL =
//  process.env.NODE_ENV === 'production' ? 'https://thesis.tefkah.com/' : 'http://localhost:3000/'

export default async function fetcher(resource: string, init?: { [key: string]: string | number }) {
  // const url = resource.replace(/(https:\/\/)?.*/g, '$1') ? resource : `${BASE_URL}${resource}`
  // console.log(url)
  return axios.get(resource, init).then((res) => res.data)
}
