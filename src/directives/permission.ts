import type { App, Directive } from 'vue'
import { useUserStore } from '@/stores/user'

/**
 * 按钮级权限：无权限时直接移除元素。
 *
 * 用法：
 *   v-permission="'user:create'"
 *   v-permission="['user:create', 'user:update']"
 */
const permission: Directive<HTMLElement, string | string[] | undefined> = {
  mounted(el, binding) {
    const userStore = useUserStore()
    if (!userStore.hasPermission(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  },
}

export const permissionDirective = {
  install(app: App): void {
    app.directive('permission', permission)
  },
}
