import type { RouteRecordRaw } from 'vue-router'

/** 无需登录即可访问 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/pages/error/403.vue'),
    meta: { title: '无访问权限' },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/pages/error/404.vue'),
    meta: { title: '页面不存在' },
  },
]

/**
 * 菜单路由：既是路由表，也是侧边菜单的数据源。
 * meta.hidden 的路由不渲染菜单，meta.order 控制顺序。
 */
export const menuRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/dashboard/index.vue'),
    meta: { title: '工作台', icon: 'Odometer', order: 1 },
  },
  {
    path: '/content',
    name: 'Content',
    redirect: '/content/editor',
    meta: { title: '内容管理', icon: 'Document', order: 50 },
    children: [
      {
        path: '/content/editor',
        name: 'ContentEditor',
        component: () => import('@/pages/content/editor/index.vue'),
        meta: { title: 'Markdown 编辑', icon: 'EditPen' },
      },
    ],
  },
  {
    path: '/system',
    name: 'System',
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'Setting', order: 90 },
    children: [
      {
        path: '/system/user',
        name: 'SystemUser',
        component: () => import('@/pages/system/user/index.vue'),
        meta: { title: '用户管理', icon: 'User', permissions: ['user:read'] },
      },
    ],
  },
]

/** 需要登录，统一挂在 DefaultLayout 下 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/dashboard',
    children: menuRoutes,
  },
]

/** 兜底：未匹配的路径统一走 404 */
export const fallbackRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'NotFoundCatchAll',
  redirect: '/404',
}

export const routes: RouteRecordRaw[] = [
  ...constantRoutes,
  ...asyncRoutes,
  fallbackRoute,
]
