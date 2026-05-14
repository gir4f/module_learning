import axios, { type AxiosInstance } from 'axios'

export function useApiClient(): AxiosInstance {
  const baseURL = import.meta.server ? useRequestURL().origin : '/'
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  return axios.create({
    baseURL,
    headers,
    withCredentials: true,
  })
}
