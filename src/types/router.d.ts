import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题：浏览器标签、菜单、面包屑共用 */
    title?: string
    /** 是否需要登录态 */
    requiresAuth?: boolean
    /** 访问所需权限码，命中其一即放行 */
    permissions?: string[]
    /** 使用的布局 */
    layout?: 'default' | 'blank'
    /** 是否缓存组件（配合 KeepAlive） */
    keepAlive?: boolean
    /** 是否在侧边菜单中隐藏 */
    hidden?: boolean
    /** 菜单图标：Element Plus 图标组件名 */
    icon?: string
    /** 菜单排序，越小越靠前 */
    order?: number
  }
}

export {}
