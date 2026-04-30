# Copilot Instructions — pomodoro-vue

## Overview
A minimal Pomodoro timer web app, deployed on EC2 and distributed via Docker images.

## Tech Stack
- **Framework**: Vue 3 (Composition API + `<script setup lang="ts">`), Options API is not allowed
- **UI**: Vuetify 4, icons via MDI (`@mdi/font`)
- **Router**: Vue Router 5
- **Build**: Vite 8 + vite-plugin-vuetify (autoImport: true) + vite-plugin-pwa (Service Worker, offline support)
- **Types**: TypeScript 6, strict mode
- **Analytics**: Umami Analytics (privacy-friendly, no cookies, custom events)
- **Package manager**: pnpm, npm and yarn are not allowed
- **Container**: Containerfile (podman/docker compatible), static-web-server for static file serving
- **Task runner**: Taskfile.yml (go-task)

## Project Structure
```
src/
  App.vue          # root component, contains navbar and side drawer
  main.ts          # entry point
  components/
    Pomodoro.vue   # core timer component
  views/
    Home.vue       # home page, embeds Pomodoro component
    Settings.vue   # settings page, alert sound selection
  assets/
    bell.mp3                   # bell alert sound
    rain_forest.mp3            # rain forest ambient sound
    keep-screen-on.js          # Wake Lock API wrapper
  plugins/
    vuetify.ts     # Vuetify config, dark theme
  router/
    index.ts       # routes: / home, /settings settings
```

## Language
- All code comments, documentation, variable names, function names, and commit messages **must be in English**

## Code Style
- **Avoid unnecessary comments**; code should be self-explanatory. Only comment to explain "why" (business context, non-obvious decisions)
- **Do not add docstrings or type annotations** to code that was not modified
- **Avoid over-abstraction**; write single-use logic inline in the component
- **Do not introduce new dependencies** unless explicitly requested
- Vuetify components are used directly without manual imports (autoImport is enabled)
- Use `ref()` for reactive state, avoid `reactive()`
- Call localStorage directly, no need to wrap it

## Testing
- Test framework: Vitest + Vue Test Utils
- Unit tests in `src/utils/pomodoro.test.ts`, covering core timer logic
- Run: `task test`
- E2E: Playwright, tests in `e2e/pomodoro.spec.ts`, run: `task e2e`

## Deployment
- Push to `main` branch triggers GitHub Actions
- Builds Docker image and pushes to GHCR (ghcr.io/wiloon/pomodoro-vue)
- Deploys to EC2 via SSH
