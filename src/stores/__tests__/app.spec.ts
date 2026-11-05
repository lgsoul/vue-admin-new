import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAppStore } from '../app'

describe('useAppStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('默认侧边栏为展开状态', () => {
    const store = useAppStore()
    expect(store.sidebarCollapsed).toBe(false)
  })

  it('toggleSidebar 会来回切换折叠状态', () => {
    const store = useAppStore()

    store.toggleSidebar()
    expect(store.sidebarCollapsed).toBe(true)

    store.toggleSidebar()
    expect(store.sidebarCollapsed).toBe(false)
  })
})
