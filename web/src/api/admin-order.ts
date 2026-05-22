import request from '@/utils/request'
import { unwrapResponse } from '@/utils/api'
import type { ApiResponse, OrderItem, PageResult } from '@/types/api'

export interface AdminOrderQuery {
  page?: number
  limit?: number
  feijiName?: string
  yonghuName?: string
  yonghuPhone?: string
}

export async function getAdminOrderList(params: AdminOrderQuery = {}) {
  const res = await request.get<ApiResponse<PageResult<OrderItem>>>('/feijiOrder/page', { params })
  return unwrapResponse(res)
}
