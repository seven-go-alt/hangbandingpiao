import request from '@/utils/request'
import { unwrapResponse } from '@/utils/api'
import type { AdminUserItem, ApiResponse, PageResult } from '@/types/api'

export interface AdminUserQuery {
  page?: number
  limit?: number
  username?: string
  yonghuName?: string
  yonghuPhone?: string
  yonghuIdNumber?: string
  sexTypes?: string | number
}

export async function getAdminUserList(params: AdminUserQuery = {}) {
  const res = await request.get<ApiResponse<PageResult<AdminUserItem>>>('/yonghu/page', { params })
  return unwrapResponse(res)
}

export async function getAdminUserDetail(id: number | string) {
  const res = await request.get<ApiResponse<AdminUserItem>>(`/yonghu/detail/${id}`)
  return unwrapResponse(res)
}
