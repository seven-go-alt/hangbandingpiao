import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/api'

export function unwrapResponse<T>(response: AxiosResponse<ApiResponse<T>>) {
  const data = response.data
  if (typeof data?.code === 'number' && data.code !== 0) {
    throw new Error(data.msg || '请求失败')
  }
  return data
}
