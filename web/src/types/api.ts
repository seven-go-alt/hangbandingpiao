export interface ApiResponse<T = unknown> {
  code: number
  msg?: string
  data?: T
  token?: string
  role?: string
  username?: string
  tableName?: string
  userId?: number
}

export interface PageResult<T> {
  currPage: number
  list: T[]
  pageSize: number
  totalCount: number
  totalPage: number
}

export interface UserInfo {
  id: number
  username: string
  yonghuName?: string
  yonghuPhone?: string
  yonghuIdNumber?: string
  sexTypes?: number | string
  sexValue?: string
  newMoney?: number
  yonghuPhoto?: string
}

export interface AdminUserItem extends UserInfo {
  createTime?: string
}

export interface FlightItem {
  id: number
  feijiName: string
  feijiTypes?: number | string
  feijiValue?: string
  feijiLeixingTypes?: number | string
  feijiLeixingValue?: string
  feijiStartTime?: string
  feijiStartAddress?: string
  feijiEndAddress?: string
  feijiNewMoney?: number
  feijiPhoto?: string
  feijiContent?: string
}

export interface NewsItem {
  id: number
  newsName: string
  newsTypes?: number | string
  newsValue?: string
  newsPhoto?: string
  insertTime?: string
  newsContent?: string
}

export interface OrderItem {
  id: number
  feijiId: number
  yonghuId?: number
  feijiOrderUuidNumber?: string
  feijiOrderTypes?: number | string
  feijiOrderValue?: string
  insertTime?: string
  createTime?: string
  feijiName?: string
  feijiStartAddress?: string
  feijiEndAddress?: string
  feijiStartTime?: string
  feijiNewMoney?: number
  yonghuName?: string
  yonghuPhone?: string
  yonghuIdNumber?: string
  newMoney?: number
}
