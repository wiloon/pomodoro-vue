# Copilot Instructions — pomodoro-vue

## 项目概述
一个极简番茄钟 Web 应用，部署在 EC2，通过 Docker 镜像分发。

## 技术栈
- **框架**: Vue 3（Composition API + `<script setup lang="ts">`），禁止使用 Options API
- **UI**: Vuetify 3，图标用 MDI（`@mdi/font`）
- **路由**: Vue Router 4
- **构建**: Vite 6 + vite-plugin-vuetify（autoImport: true）
- **类型**: TypeScript 5，严格模式
- **包管理**: pnpm，禁止使用 npm 或 yarn
- **容器**: Containerfile（podman/docker 兼容），static-web-server 作为静态文件服务
- **任务运行**: Taskfile.yml（go-task）

## 项目结构
```
src/
  App.vue          # 根组件，含导航栏和侧边抽屉
  main.ts          # 入口
  components/
    Pomodoro.vue   # 核心计时组件
  views/
    Home.vue       # 首页，嵌套 Pomodoro 组件
    Settings.vue   # 设置页，提示音选择
  assets/
    bell.mp3                        # 铃声提示音
    rain_forest.mp3                # 雨声提示音
    keep-screen-on.js       # Wake Lock API 封装
  plugins/
    vuetify.ts     # Vuetify 配置，dark 主题
  router/
    index.ts       # 路由：/ 首页，/settings 设置
```

## 业务规则
- 番茄钟有两种类型：`L`（长，25 分钟）和 `S`（短，5 分钟），点 tick 按钮切换
- `dingInterval`：每隔多少秒触发一次提示音（默认 10秒），在设置页调整，保存在 `localStorage`，key 为 `pomodoro-ding-interval`
- 提示音选择保存在 `localStorage`，key 为 `pomodoro-alert-sound`，可选值：`bell` | `rain`
- Wake Lock API 在页面加载时激活，防止屏幕休眠

## 代码规范
- **避免多余注释**，代码本身应具备可读性；只在解释"为什么"（业务背景、非显然的决策）时加注释
- **不加多余的 docstring 或类型注解**到未修改的代码
- **不过度封装**，单次使用的逻辑直接写在组件内
- **不引入新依赖**，除非明确被要求
- Vuetify 组件直接使用，无需手动 import（autoImport 已开启）
- 使用 `ref()` 管理响应式状态，避免使用 `reactive()`
- localStorage 操作直接调用，无需封装

## 测试
- 测试框架：Vitest + Vue Test Utils
- 单元测试位于 `src/utils/pomodoro.test.ts`，覆盖核心计时逻辑
- 运行：`task test`
- E2E：Playwright，测试位于 `e2e/pomodoro.spec.ts`，运行：`task e2e`

## 部署
- push 到 `main` 分支触发 GitHub Actions
- 构建 Docker 镜像推送到 GHCR（ghcr.io/wiloon/pomodoro-vue）
- 通过 SSH 部署到 EC2
