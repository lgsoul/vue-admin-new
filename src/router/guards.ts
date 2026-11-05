import NProgress from 'nprogress'
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'

NProgress.configure({ showSpinner: false })

/** 无需登录即可访问的路径 */
const WHITE_LIST = ['/login', '/403', '/404']

export function setupRouterGuards(router: Router): void {
  router.beforeEach(async (to) => {
    NProgress.start()

    const userStore = useUserStore()

    // 未登录：白名单放行，其余回登录页并记录来源
    if (!userStore.isLoggedIn) {
      if (WHITE_LIST.includes(to.path)) return true
      return { path: '/login', query: { redirect: to.fullPath } }
    }

    // 已登录还去登录页，直接回首页
    if (to.path === '/login') return { path: '/' }

    // 首次进入时拉取用户信息，失败视为登录失效
    if (!userStore.profileLoaded) {
      try {
        await userStore.fetchProfile()
      } catch {
        userStore.reset()
        return { path: '/login', query: { redirect: to.fullPath } }
      }
    }

    // 路由级权限校验
    if (!userStore.hasPermission(to.meta.permissions)) {
      return { path: '/403' }
    }

    return true
  })

  router.afterEach((to) => {
    const appTitle = import.meta.env.VITE_APP_TITLE
    document.title = to.meta.title ? `${to.meta.title} - ${appTitle}` : appTitle
    NProgress.done()
  })

  router.onError(() => {
    NProgress.done()
  })
}
