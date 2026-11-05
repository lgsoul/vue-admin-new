import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '../user'

/**
 * 打通「store → Orval 生成的函数 → request mutator → axios → MSW」整条链路。
 * 这层验证的是契约：只要 openapi.json 与 handlers 对得上，登录就一定通。
 */
describe('登录链路（含 MSW）', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('账号密码正确时写入 token 并拉到用户信息', async () => {
    const store = useUserStore()

    await store.login({ username: 'admin', password: '123456' })

    expect(store.isLoggedIn).toBe(true)
    expect(store.token).toBe('mock-token-admin')
    expect(localStorage.getItem('admin_token')).toBe('mock-token-admin')

    await store.fetchProfile()

    expect(store.nickname).toBe('超级管理员')
    expect(store.hasPermission('user:create')).toBe(true)
    expect(store.hasPermission('order:read')).toBe(false)
  })

  it('密码错误时抛出业务错误，且不写入 token', async () => {
    const store = useUserStore()

    await expect(store.login({ username: 'admin', password: 'wrong-password' })).rejects.toThrow(
      '用户名或密码错误',
    )

    expect(store.isLoggedIn).toBe(false)
  })

  it('退出登录会清空 token', async () => {
    const store = useUserStore()
    await store.login({ username: 'admin', password: '123456' })
    expect(store.isLoggedIn).toBe(true)

    await store.logout()

    expect(store.isLoggedIn).toBe(false)
    expect(localStorage.getItem('admin_token')).toBeNull()
  })
})
