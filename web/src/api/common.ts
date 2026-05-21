import request from '@/utils/request'
import { unwrapResponse } from '@/utils/api'
import type { ApiResponse, PageResult } from '@/types/api'

export interface ConfigItem {
  id: number
  name?: string
  value?: string
}

export async function getConfigList(params: { page?: number; limit?: number } = {}) {
  const res = await request.get<ApiResponse<PageResult<ConfigItem>>>('/config/list', { params })
  return unwrapResponse(res)
}
