import { useUserStore } from '@/stores/user'

/**
 * 权限判断入口。
 * 逻辑分支用 hasPermission()，模板内简单显隐可直接用 v-permission 指令。
 */
export function usePermission() {
  const userStore = useUserStore()

  function hasPermission(code?: string | string[]): boolean {
    return userStore.hasPermission(code)
  }

  return { hasPermission }
}
