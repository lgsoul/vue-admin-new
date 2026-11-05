import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/** 浏览器端 mock worker，仅在 VITE_ENABLE_MOCK=true 时启动 */
export const worker = setupWorker(...handlers)
