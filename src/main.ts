import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import { permissionDirective } from './directives/permission'

import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'
import 'virtual:uno.css'
import '@/styles/index.scss'

async function bootstrap(): Promise<void> {
  // 本地 Mock：VITE_ENABLE_MOCK=true 时不依赖后端即可开发
  if (import.meta.env.VITE_ENABLE_MOCK === 'true') {
    try {
      const { worker } = await import('./mocks/browser')
      await worker.start()
    } catch (error) {
      console.warn('[mock] 启动失败，已跳过：', error)
    }
  }

  const app = createApp(App)

  // 全局注册 Element Plus 图标，模板里可直接 <component :is="'User'" />
  for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(name, component)
  }

  app.use(createPinia())
  app.use(router)
  app.use(permissionDirective)

  app.mount('#app')
}

void bootstrap()
