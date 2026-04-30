import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Settings from '@/views/Settings.vue'
import Help from '@/views/Help.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/help',
      name: 'help',
      component: Help
    },
  ]
})

export default router
