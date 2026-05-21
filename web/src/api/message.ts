import request from '@/utils/request'
import { unwrapResponse } from '@/utils/api'
import type { ApiResponse, PageResult } from '@/types/api'

export interface MessageItem {
  id: number
  feijiId: number
  yonghuId: number
  feijiLiuyanContent: string
  replyContent?: string
  insertTime?: string
  yonghuName?: string
}

export async function getMessageList(params: { page?: number; limit?: number; feijiId?: number } = {}) {
  const res = await request.get<ApiResponse<PageResult<MessageItem>>>('/feijiLiuyan/list', { params })
  return unwrapResponse(res)
}

export async function createMessage(payload: { feijiId: number; yonghuId: number; feijiLiuyanContent: string }) {
  const res = await request.post<ApiResponse>('/feijiLiuyan/add', payload)
  return unwrapResponse(res)
}
