import request from '@/utils/request'
import { unwrapResponse } from '@/utils/api'
import type { ApiResponse, FlightItem, PageResult } from '@/types/api'

export interface FlightQuery {
  page?: number
  limit?: number
  flag?: number
  feijiName?: string
  feijiTypes?: string | number
  feijiStartAddress?: string
  feijiEndAddress?: string
  feijiNewMoneyStart?: number | string
  feijiNewMoneyEnd?: number | string
}

export async function getFlightList(params: FlightQuery) {
  const res = await request.get<ApiResponse<PageResult<FlightItem>>>('/feiji/list', { params })
  return unwrapResponse(res)
}

export async function getFlightDetail(id: number | string) {
  const res = await request.get<ApiResponse<FlightItem>>(`/feiji/detail/${id}`)
  return unwrapResponse(res)
}
