import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getSession, login as loginApi, logout as logoutApi, type LoginPayload } from '@/api/auth'
import type { UserInfo } from '@/types/api'
import { clearAuthStorage, getStorage, setStorage, TOKEN_KEY, USER_ID_KEY, USER_NAME_KEY, USER_ROLE_KEY, USER_TABLE_KEY } from '@/utils/storage'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getStorage(TOKEN_KEY) || '')
  const roleLabel = ref(getStorage(USER_ROLE_KEY) || '')
  const username = ref(getStorage(USER_NAME_KEY) || '')
  const userTable = ref(getStorage(USER_TABLE_KEY) || '')
  const userId = ref(Number(getStorage(USER_ID_KEY) || 0))
  const profile = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => Boolean(token.value))

  function applyLogin(payload: { token: string; role?: string; username?: string; tableName?: string; userId?: number }) {
    token.value = payload.token
    roleLabel.value = payload.role || ''
    username.value = payload.username || ''
    userTable.value = payload.tableName || 'yonghu'
    userId.value = payload.userId || 0
    setStorage(TOKEN_KEY, token.value)
    setStorage(USER_ROLE_KEY, roleLabel.value)
    setStorage(USER_NAME_KEY, username.value)
    setStorage(USER_TABLE_KEY, userTable.value)
    setStorage(USER_ID_KEY, String(userId.value))
  }

  async function login(payload: LoginPayload) {
    const res = await loginApi(payload)
    applyLogin({
      token: res.token || '',
      role: res.role,
      username: res.username,
      tableName: res.tableName,
      userId: res.userId,
    })
    await fetchSession()
  }

  async function fetchSession() {
    if (!token.value) return null
    const res = await getSession()
    profile.value = res.data || null
    return profile.value
  }

  async function logout() {
    try {
      if (token.value) {
        await logoutApi()
      }
    } finally {
      token.value = ''
      roleLabel.value = ''
      username.value = ''
      userTable.value = ''
      userId.value = 0
      profile.value = null
      clearAuthStorage()
    }
  }

  return {
    token,
    roleLabel,
    username,
    userTable,
    userId,
    profile,
    isLoggedIn,
    login,
    fetchSession,
    logout,
  }
})
