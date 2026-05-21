import request from '@/utils/request'
import { unwrapResponse } from '@/utils/api'
import type { ApiResponse, UserInfo } from '@/types/api'

export async function updateProfile(payload: Partial<UserInfo> & { id: number; username: string }) {
  const res = await request.post<ApiResponse>('/yonghu/update', payload)
  return unwrapResponse(res)
}
