import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./tests/setup.ts'],
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),

      // 测试环境没有 .env.development，显式注入接口前缀，保证请求能命中 MSW
      env: {
        VITE_API_BASE_URL: '/api',
        VITE_APP_TITLE: '管理后台',
        VITE_ENABLE_MOCK: 'false',
      },

      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
        // 先只纳入纯逻辑层；组件与页面交给 E2E，逐步扩大范围
        include: ['src/utils/**', 'src/composables/**', 'src/stores/**'],
        exclude: ['src/**/*.d.ts', 'src/**/__tests__/**'],
        thresholds: {
          lines: 60,
          functions: 60,
          branches: 50,
        },
      },
    },
  }),
)
