import { defineConfig } from 'orval'

/**
 * 契约驱动：从 OpenAPI 文档生成 TS 类型 + 请求函数。
 * 前端不手写接口类型，接口变更由 tsc 报错暴露。
 *
 * 输出为单文件，import 路径稳定；接口规模大了再拆 tags-split。
 */
export default defineConfig({
  admin: {
    input: {
      target: './openapi.json',
    },
    output: {
      target: './src/api/generated/endpoints.ts',
      client: 'axios-functions',
      clean: true,
      prettier: true,
      override: {
        // 生成的函数统一走自建 axios 实例，自动带上拦截器与鉴权
        mutator: {
          path: './src/api/request.ts',
          name: 'request',
        },
      },
    },
  },
})
