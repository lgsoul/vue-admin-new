import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

/**
 * MSW 的 Service Worker 只在开发环境需要，所以它放在 src/mocks/ 而不是 public/，
 * 这样它不会被打进生产产物。开发时由这个中间件把它挂到 /mockServiceWorker.js。
 * （不能直接让 Vite 从 src/ 提供，否则会被当成模块注入 HMR 代码，SW 会报错。）
 */
function mswWorker(): Plugin {
  const workerFile = fileURLToPath(
    new URL('./src/mocks/mockServiceWorker.js', import.meta.url),
  )

  return {
    name: 'local:msw-worker',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] !== '/mockServiceWorker.js') return next()
        if (!existsSync(workerFile)) return next()

        res.setHeader('Content-Type', 'application/javascript')
        res.setHeader('Service-Worker-Allowed', '/')
        res.end(readFileSync(workerFile))
      })
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    UnoCSS(),
    mswWorker(),

    // Vue / Router / Pinia / VueUse 的 API 免手动 import
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
      resolvers: [ElementPlusResolver(), IconsResolver({ prefix: 'Icon' })],
      dts: 'src/types/auto-imports.d.ts',
    }),

    // Element Plus 组件与图标按需自动引入
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({ enabledCollections: ['ep'], prefix: 'Icon' }),
      ],
      dts: 'src/types/components.d.ts',
    }),

    Icons({ autoInstall: false }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        // 联调时用系统环境变量覆盖：VITE_PROXY_TARGET=http://x.x.x.x:8080
        target: process.env.VITE_PROXY_TARGET ?? 'http://localhost:8080',
        changeOrigin: true,
        // 后端接口本身不带 /api 前缀时保留这行，反之删掉
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  build: {
    chunkSizeWarningLimit: 1500,
    // Vite 8 底层是 Rolldown，分包交给它自动处理，无需手工 manualChunks
  },
})
