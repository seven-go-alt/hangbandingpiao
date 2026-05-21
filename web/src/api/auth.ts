import request from '@/utils/request'
import { unwrapResponse } from '@/utils/api'
import type { ApiResponse, UserInfo } from '@/types/api'

export interface LoginPayload {
  username: string
  password: string
  role: 'yonghu'
}

export interface RegisterPayload {
  username: string
  password: string
  yonghuName: string
  yonghuPhone: string
  yonghuIdNumber: string
  sexTypes?: number
}

export async function login(payload: LoginPayload) {
  const res = await request.get<ApiResponse>(`/${payload.role}/login`, {
    params: payload,
  })
  return unwrapResponse(res)
}

export async function getSession() {
  const res = await request.get<ApiResponse<UserInfo>>('/yonghu/session')
  return unwrapResponse(res)
}

export async function register(payload: RegisterPayload) {
  const res = await request.post<ApiResponse>('/yonghu/register', payload)
  return unwrapResponse(res)
}

export async function logout() {
  const res = await request.get<ApiResponse>('/yonghu/logout')
  return unwrapResponse(res)
}
