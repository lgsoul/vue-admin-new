import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '../user'

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('默认处于未登录状态', () => {
    const store = useUserStore()
    expect(store.isLoggedIn).toBe(false)
    expect(store.permissions).toEqual([])
  })

  it('不传权限码时默认放行', () => {
    const store = useUserStore()
    expect(store.hasPermission()).toBe(true)
    expect(store.hasPermission([])).toBe(true)
  })

  it('按权限码判断，命中其一即放行', () => {
    const store = useUserStore()
    store.profile = { permissions: ['user:read'] }

    expect(store.hasPermission('user:read')).toBe(true)
    expect(store.hasPermission('user:delete')).toBe(false)
    expect(store.hasPermission(['user:delete', 'user:read'])).toBe(true)
  })

  it('reset 会清空登录态与用户信息', () => {
    const store = useUserStore()
    store.token = 'fake-token'
    store.profile = { username: 'admin' }

    store.reset()

    expect(store.isLoggedIn).toBe(false)
    expect(store.profile).toBeNull()
  })
})
