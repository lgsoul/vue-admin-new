/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 应用标题，用于浏览器标签与顶栏 */
  readonly VITE_APP_TITLE: string
  /** 接口前缀 */
  readonly VITE_API_BASE_URL: string
  /** 是否启用 MSW 本地 Mock */
  readonly VITE_ENABLE_MOCK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
