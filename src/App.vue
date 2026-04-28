<template>
  <v-app>
    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" link />
        <v-list-item prepend-icon="mdi-cog" title="Settings" link />
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
import { ref, onMounted } from 'vue'
import { wakeLock } from './assets/keep-screen-on.js'

const drawer = ref(false)

onMounted(() => {
  wakeLock()
})
</script>

<style>
html, body {
  overflow: hidden;
}
</style>
