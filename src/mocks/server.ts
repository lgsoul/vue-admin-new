import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/** Node 端 mock server，供 Vitest 复用同一套契约 */
export const server = setupServer(...handlers)
