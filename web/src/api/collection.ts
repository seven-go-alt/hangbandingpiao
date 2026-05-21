import request from '@/utils/request'
import { unwrapResponse } from '@/utils/api'
import type { ApiResponse, PageResult } from '@/types/api'

export interface CollectionItem {
  id: number
  feijiId: number
  yonghuId: number
  insertTime?: string
  feijiName?: string
  feijiStartAddress?: string
  feijiEndAddress?: string
  feijiStartTime?: string
  feijiNewMoney?: number
  feijiPhoto?: string
}

export async function getCollectionList(params: { page?: number; limit?: number } = {}) {
  const res = await request.get<ApiResponse<PageResult<CollectionItem>>>('/feijiCollection/list', { params })
  return unwrapResponse(res)
}

export async function createCollection(payload: { feijiId: number; yonghuId: number }) {
  const res = await request.post<ApiResponse>('/feijiCollection/add', payload)
  return unwrapResponse(res)
}

export async function deleteCollection(ids: number[]) {
  const res = await request.post<ApiResponse>('/feijiCollection/delete', ids)
  return unwrapResponse(res)
}
