/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module 'vuetify/styles' { }

interface UmamiTracker {
  track(event: string, data?: Record<string, string | number | boolean>): void
}

interface Window {
  umami?: UmamiTracker
}
