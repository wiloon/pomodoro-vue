<template>
  <div class="home-wrapper">
    <Pomodoro />
  </div>
</template>

<script setup lang="ts">
import Pomodoro from '@/components/Pomodoro.vue'
</script>

<style scoped>
.home-wrapper {
  height: calc(100dvh - 64px - 32px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 8%;
}
</style>
