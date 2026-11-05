/** 本地存储 key，集中管理避免散落各处 */
export const STORAGE_KEYS = {
  token: 'admin_token',
} as const

/** 权限码：与后端约定保持一致，路由 meta.permissions 与 v-permission 共用 */
export const PERMISSIONS = {
  USER_READ: 'user:read',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
} as const

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

/** 用户状态：1 启用 / 0 停用 */
export const USER_STATUS = {
  DISABLED: 0,
  ENABLED: 1,
} as const

export const USER_STATUS_OPTIONS = [
  { label: '启用', value: USER_STATUS.ENABLED },
  { label: '停用', value: USER_STATUS.DISABLED },
] as const
