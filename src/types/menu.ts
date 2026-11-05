import type { RouteMeta } from 'vue-router'

/** 侧边菜单节点：从路由表裁剪出的最小结构 */
export interface MenuItem {
  path: string
  meta?: RouteMeta
  children?: MenuItem[]
}
