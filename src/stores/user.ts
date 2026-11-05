import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getProfile, login as loginRequest, logout as logoutRequest } from '@/api'
import type { LoginParams, UserProfile } from '@/api'
import { clearToken, getToken, setToken } from '@/api/request'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const profile = ref<UserProfile | null>(null)
  /** 是否已尝试拉取过用户信息，避免每次路由跳转都请求 */
  const profileLoaded = ref(false)

  const isLoggedIn = computed(() => Boolean(token.value))
  const username = computed(() => profile.value?.username ?? '')
  const nickname = computed(() => profile.value?.nickname ?? '')
  const permissions = computed(() => profile.value?.permissions ?? [])

  /** 命中任一权限码即放行；不传权限码表示无需校验 */
  function hasPermission(code?: string | string[]): boolean {
    if (!code) return true
    const required = Array.isArray(code) ? code : [code]
    if (required.length === 0) return true
    return required.some((item) => permissions.value.includes(item))
  }

  async function login(params: LoginParams): Promise<void> {
    const result = await loginRequest(params)
    const nextToken = result?.token ?? ''
    token.value = nextToken
    setToken(nextToken)
  }

  async function fetchProfile(): Promise<void> {
    profile.value = await getProfile()
    profileLoaded.value = true
  }

  async function logout(): Promise<void> {
    try {
      await logoutRequest()
    } catch {
      // 退出接口失败也要清掉本地状态
    }
    reset()
  }

  function reset(): void {
    token.value = ''
    profile.value = null
    profileLoaded.value = false
    clearToken()
  }

  return {
    token,
    profile,
    profileLoaded,
    isLoggedIn,
    username,
    nickname,
    permissions,
    hasPermission,
    login,
    fetchProfile,
    logout,
    reset,
  }
})
