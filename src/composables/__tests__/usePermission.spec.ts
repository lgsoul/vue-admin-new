import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePermission } from '../usePermission'
import { useUserStore } from '@/stores/user'

describe('usePermission', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('不传权限码时放行', () => {
    const { hasPermission } = usePermission()
    expect(hasPermission()).toBe(true)
  })

  it('按当前用户的权限码判断', () => {
    const userStore = useUserStore()
    userStore.profile = { permissions: ['user:read'] }

    const { hasPermission } = usePermission()

    expect(hasPermission('user:read')).toBe(true)
    expect(hasPermission('user:delete')).toBe(false)
    expect(hasPermission(['user:delete', 'user:read'])).toBe(true)
  })
})
