import request from '@/utils/request'
import { unwrapResponse } from '@/utils/api'
import type { ApiResponse, FlightItem, PageResult } from '@/types/api'

export interface AdminFlightQuery {
  page?: number
  limit?: number
  feijiName?: string
  feijiStartAddress?: string
  feijiEndAddress?: string
}

export async function getAdminFlightList(params: AdminFlightQuery = {}) {
  const res = await request.get<ApiResponse<PageResult<FlightItem>>>('/feiji/page', { params })
  return unwrapResponse(res)
}
