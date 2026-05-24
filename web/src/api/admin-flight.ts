import request from '@/utils/request'
import { unwrapResponse } from '@/utils/api'
import type { ApiResponse, FlightItem, PageResult } from '@/types/api'

export interface AdminFlightQuery {
  page?: number
  limit?: number
  feijiName?: string
  feijiTypes?: string | number
  feijiLeixingTypes?: string | number
  feijiStartAddress?: string
  feijiEndAddress?: string
  feijiNewMoneyStart?: number | string
  feijiNewMoneyEnd?: number | string
}

export async function getAdminFlightList(params: AdminFlightQuery = {}) {
  const res = await request.get<ApiResponse<PageResult<FlightItem>>>('/feiji/page', { params })
  return unwrapResponse(res)
}

export async function getAdminFlightDetail(id: number | string) {
  const res = await request.get<ApiResponse<FlightItem>>(`/feiji/detail/${id}`)
  return unwrapResponse(res)
}
