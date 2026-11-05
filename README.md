# admin

PC 管理后台前端。基于 Vue 3 + TypeScript + Vite 8，按 2026 年主流技术栈初始化。

## 技术栈

| 层 | 选型 | 说明 |
| --- | --- | --- |
| 框架 | Vue 3.5 | 组合式 API + `<script setup>` |
| 构建 | Vite 8 | 底层已切换到 Rolldown（Rust） |
| 语言 | TypeScript 6 | 全量 strict |
| 路由 | Vue Router 5 | 路由元信息已做类型增强 |
| 状态 | Pinia 4 | Setup 语法 |
| UI | Element Plus 2 | 组件与图标按需自动引入 |
| 样式 | UnoCSS + SCSS | 原子类 + 全局变量 |
| 请求 | axios | 统一实例 + 拦截器，Orval 生成函数走同一入口 |
| 契约 | Orval | OpenAPI → TS 类型 + 请求函数 + MSW mock |
| Mock | MSW 3 | 开发与测试共用同一套契约 |
| 测试 | Vitest 4 + Playwright | 单元/组件 + 端到端 |
| 规范 | Oxlint + ESLint 10 + Prettier | 快速扫描 + 类型感知规则 |

## 快速开始

```bash
npm install
npm run dev
```

> 若 `npm install` 报 `Cannot read properties of null (reading 'edgesOut')`，是 npm 10.x 的 arborist 在 peer 依赖递归时崩溃，加 `--legacy-peer-deps` 即可：
>
> ```bash
> npm install --legacy-peer-deps
> ```

开发环境默认开启本地 Mock，无需后端即可跑通登录与列表页：

- 账号：`admin`
- 密码：`123456`

## 常用脚本

```bash
npm run dev           # 启动开发服务
npm run build         # 类型检查 + 生产构建
npm run type-check    # 仅类型检查
npm run lint          # Oxlint + ESLint（自动修复）
npm run format        # Prettier 格式化
npm run test:unit     # 单元测试
npm run test:coverage # 单元测试 + 覆盖率
npm run test:e2e      # 端到端测试（首次需 npx playwright install）
npm run gen:api       # 从 openapi.json 生成接口代码
```

## 目录结构

```
src/
├─ api/            接口层，唯一允许直接发请求的地方
│  ├─ generated/   Orval 产物，禁止手改
│  └─ request.ts   axios 实例 + 拦截器 + Orval mutator
├─ components/     通用组件（base 无业务语义 / business 跨页复用）
├─ composables/    组合式函数
├─ constants/      枚举、字典、常量
├─ directives/     自定义指令（v-permission）
├─ layouts/        布局（DefaultLayout / BlankLayout）
├─ mocks/          MSW handlers + worker（worker 放这里，不进生产产物）
├─ pages/          路由页面
├─ router/         路由表 + 守卫
├─ stores/         Pinia，按业务域拆分
├─ styles/         全局样式与 CSS 变量
├─ types/          全局类型声明
└─ utils/          纯函数工具
```

**依赖方向必须单向**：`pages → components/composables → stores/api → utils`，不要反向 import。

## 开发约定

### 接口

1. 后端提供 OpenAPI 文档，替换根目录 `openapi.json`（或把 `orval.config.ts` 的 input 指向文档 URL）
2. 执行 `npm run gen:api`
3. 业务代码使用生成的函数与类型，**不要手写接口类型**

接口变更时 `npm run type-check` 会直接报错，不用等联调。

### 路由与权限

- 菜单路由集中在 `src/router/routes.ts` 的 `menuRoutes`，侧边菜单由它生成
- `meta.hidden` 隐藏菜单，`meta.order` 控制排序，`meta.permissions` 控制路由级权限
- 按钮级权限用 `v-permission="'user:create'"` 指令，或 `usePermission()` 做逻辑分支
- 路由元信息类型在 `src/types/router.d.ts`，新增字段在那里补

### 提交

使用 Conventional Commits：

```
feat(user): 新增用户导入
fix(login): 修复 token 过期未跳转
```

提交前 husky 会自动跑 lint-staged（暂存文件）与 commitlint（提交信息格式）。

## 环境变量

| 变量 | 说明 |
| --- | --- |
| `VITE_APP_TITLE` | 应用标题 |
| `VITE_API_BASE_URL` | 接口前缀 |
| `VITE_ENABLE_MOCK` | 是否启用本地 MSW Mock |
| `VITE_PROXY_TARGET` | 开发代理目标（仅 dev） |

## CI

`.github/workflows/ci.yml`：install → type-check → lint → unit → build → e2e，构建产物与失败报告自动上传。
