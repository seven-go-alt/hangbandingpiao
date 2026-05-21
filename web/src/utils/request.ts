import axios from 'axios'
import { clearAuthStorage, getStorage, TOKEN_KEY } from '@/utils/storage'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

request.interceptors.request.use((config) => {
  const token = getStorage(TOKEN_KEY)
  if (token) {
    config.headers.Token = token
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    const data = response.data
    if (typeof data?.code === 'number' && data.code === 401) {
      clearAuthStorage()
    }
    return response
  },
  (error) => Promise.reject(error),
)

export default request
