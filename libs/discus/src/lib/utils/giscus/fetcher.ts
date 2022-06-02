// ported from the great https://github.com/giscus/giscus

// Giscus
import { isEmpty } from './utils'

export class CustomError extends Error {
  status: number

  data: Record<string, unknown>

  constructor(m: string, status: number, data?: Record<string, unknown>) {
    super(m)
    this.status = status
    this.data = data!
  }
}

export const fetcher = async (input: RequestInfo, init?: RequestInit) => {
  const res = await fetch(input, init)
  const data = await res.json()
  if (!res.ok) {
    throw new CustomError(data?.error || res.statusText, res.status, data)
  }
  return data
}

export const cleanParams = (params: Record<string, unknown>) =>
  Object.entries(params).reduce(
    (prev, [key, value]) => (!isEmpty(value) ? { ...prev, [key]: value } : prev),
    {},
  )
