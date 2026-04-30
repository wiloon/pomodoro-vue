<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" theme="light">
      <v-list nav>
        <v-list-item prepend-icon="mdi-timer" title="Pomodoro" link to="/" />
        <v-list-item prepend-icon="mdi-cog" title="Settings" link to="/settings" />
        <v-list-item prepend-icon="mdi-help-circle" title="Help" link to="/help" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" data-testid="nav-toggle" />
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
import { ref, onMounted } from 'vue'
import { wakeLock } from './assets/keep-screen-on.js'

const drawer = ref(false)

onMounted(() => {
  wakeLock()
})
</script>

<style>
*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
}
</style>
