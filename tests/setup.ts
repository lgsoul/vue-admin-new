import { server } from '@/mocks/server'

// 测试复用与开发环境同一套 Mock 契约，避免两处维护
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
