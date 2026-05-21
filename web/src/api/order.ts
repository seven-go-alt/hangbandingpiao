import request from '@/utils/request'
import { unwrapResponse } from '@/utils/api'
import type { ApiResponse, OrderItem, PageResult } from '@/types/api'

export interface CreateOrderPayload {
  feijiId: number
  yonghuId?: number
  feijiOrderUuidNumber: string
}

export async function getOrderList(params: { page?: number; limit?: number } = {}) {
  const res = await request.get<ApiResponse<PageResult<OrderItem>>>('/feijiOrder/list', { params })
  return unwrapResponse(res)
}

export async function createOrder(payload: CreateOrderPayload) {
  const res = await request.post<ApiResponse>('/feijiOrder/add', payload)
  return unwrapResponse(res)
}

export async function refundOrder(id: number) {
  const res = await request.get<ApiResponse>('/feijiOrder/refund', { params: { id } })
  return unwrapResponse(res)
}
