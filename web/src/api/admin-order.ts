import request from '@/utils/request'
import { unwrapResponse } from '@/utils/api'
import type { ApiResponse, OrderItem, PageResult } from '@/types/api'

export interface AdminOrderQuery {
  page?: number
  limit?: number
  feijiName?: string
  yonghuName?: string
  yonghuPhone?: string
  feijiOrderUuidNumber?: string
  feijiOrderTypes?: string | number
}

export async function getAdminOrderList(params: AdminOrderQuery = {}) {
  const res = await request.get<ApiResponse<PageResult<OrderItem>>>('/feijiOrder/page', { params })
  return unwrapResponse(res)
}

export async function getAdminOrderDetail(id: number | string) {
  const res = await request.get<ApiResponse<OrderItem>>(`/feijiOrder/detail/${id}`)
  return unwrapResponse(res)
}
