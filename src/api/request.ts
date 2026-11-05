import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

/** 后端统一响应包装 */
export interface ApiResult<T = unknown> {
  code: number
  message: string
  data: T
}

const TOKEN_KEY = 'admin_token'

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? ''
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000,
})

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

/** 并发请求同时 401 时，避免重复弹窗与重复跳转 */
let unauthorizedHandled = false

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResult>) => {
    if (error.response?.status === 401) {
      if (!unauthorizedHandled) {
        unauthorizedHandled = true
        clearToken()
        ElMessage.error('登录已失效，请重新登录')
        const redirect = encodeURIComponent(window.location.pathname + window.location.search)
        window.location.href = `/login?redirect=${redirect}`
        window.setTimeout(() => {
          unauthorizedHandled = false
        }, 1500)
      }
      return Promise.reject(error)
    }

    const message = error.response?.data?.message ?? error.message ?? '网络异常，请稍后重试'
    ElMessage.error(message)
    return Promise.reject(error)
  },
)

/**
 * Orval 的 mutator：所有生成的请求函数都经由此处。
 * 统一解包 ApiResult，业务层直接拿到 data。
 */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await instance.request<ApiResult<T>>(config)
  const body = response.data

  // 裸数据 / 204 场景直接透传
  if (body === null || typeof body !== 'object' || !('code' in body)) {
    return body as unknown as T
  }

  if (body.code !== 0 && body.code !== 200) {
    ElMessage.error(body.message || '请求失败')
    throw new Error(body.message || `业务错误 code=${body.code}`)
  }

  return body.data
}

export default instance
