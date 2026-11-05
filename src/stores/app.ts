import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useAppStore = defineStore('app', () => {
  /** 侧边栏折叠状态，持久化到本地 */
  const sidebarCollapsed = useLocalStorage('admin_sidebar_collapsed', false)

  function toggleSidebar(): void {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return { sidebarCollapsed, toggleSidebar }
})
