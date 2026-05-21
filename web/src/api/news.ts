import request from '@/utils/request'
import { unwrapResponse } from '@/utils/api'
import type { ApiResponse, NewsItem, PageResult } from '@/types/api'

export async function getNewsList(params: { page?: number; limit?: number; newsName?: string } = {}) {
  const res = await request.get<ApiResponse<PageResult<NewsItem>>>('/news/list', { params })
  return unwrapResponse(res)
}

export async function getNewsDetail(id: number | string) {
  const res = await request.get<ApiResponse<NewsItem>>(`/news/detail/${id}`)
  return unwrapResponse(res)
}
