<template>
  <v-app>
    <v-navigation-drawer v-model="drawer">
      <v-list nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" link to="/" active-color="primary" />
        <v-list-item prepend-icon="mdi-cog" title="Settings" link to="/settings" active-color="primary" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Pomodoro</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer height="32" app>
      <span class="text-caption">w10n &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from 'vuetify'
import { wakeLock } from './assets/keep-screen-on.js'

const drawer = ref(false)
const theme = useTheme()

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

function onSystemThemeChange(e: MediaQueryListEvent) {
  theme.global.name.value = e.matches ? 'dark' : 'light'
}

onMounted(() => {
  wakeLock()
  mediaQuery.addEventListener('change', onSystemThemeChange)
})

onUnmounted(() => {
  mediaQuery.removeEventListener('change', onSystemThemeChange)
})
</script>

<style>
html, body {
  overflow: hidden;
}
</style>
