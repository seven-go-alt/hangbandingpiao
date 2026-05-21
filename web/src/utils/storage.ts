export const TOKEN_KEY = 'Token'
export const USER_TABLE_KEY = 'userTable'
export const USER_ID_KEY = 'userId'
export const USER_ROLE_KEY = 'role'
export const USER_NAME_KEY = 'username'

export function getStorage(key: string) {
  return localStorage.getItem(key)
}

export function setStorage(key: string, value: string) {
  localStorage.setItem(key, value)
}

export function removeStorage(key: string) {
  localStorage.removeItem(key)
}

export function clearAuthStorage() {
  ;[TOKEN_KEY, USER_TABLE_KEY, USER_ID_KEY, USER_ROLE_KEY, USER_NAME_KEY].forEach(removeStorage)
}
