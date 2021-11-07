import useSWR from 'swr'

export default function useFetch(url: string, config?: { [key: string]: string | number }) {
  const { data, error } = useSWR(url, config)

  return { data, isLoading: !data && !error, isError: error }
}
