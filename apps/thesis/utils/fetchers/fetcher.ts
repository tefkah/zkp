// import axios from 'axios'

export const fetcher = async (resource: string, init?: { [key: string]: string | number }) =>
  fetch(resource, init)
    .then((res) => res.json())
    .then((res) => res)
