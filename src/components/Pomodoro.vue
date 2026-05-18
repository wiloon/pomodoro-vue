<template>
  <v-container class="d-flex justify-center">
    <div class="timer-card">
      <p class="text-h5 font-weight-medium mb-1 text-center">{{ timer.typeLabel }}</p>
      <p class="text-caption text-medium-emphasis mb-1 text-center">Started {{ timer.startTimeStr }}</p>
      <p class="text-caption text-medium-emphasis mb-6 text-center">
        Session {{ timer.sessionCount }} &nbsp;·&nbsp; Today {{ timer.todayCount }}
      </p>
      <v-row align="center" no-gutters class="mb-8">
        <v-col cols="auto" class="pr-4 text-body-2 timer-digit" data-testid="timer-elapsed">{{ timeLast }}</v-col>
        <v-col style="min-width: 0">
          <v-progress-linear
            :model-value="progress"
            :indeterminate="isDone"
            :color="progressBarColor"
            rounded
            height="6"
          />
        </v-col>
        <v-col cols="auto" class="pl-4 text-body-2 timer-digit" data-testid="timer-remaining">{{ timeLeft }}</v-col>
      </v-row>
      <v-row justify="center" no-gutters class="ga-3">
        <v-btn @click="advance" color="primary" prepend-icon="mdi-skip-next">Next</v-btn>
        <v-btn @click="fullScreen" prepend-icon="mdi-fullscreen">Full Screen</v-btn>
        <v-btn
          @click="togglePause"
          :color="timer.paused ? 'warning' : undefined"
          :prepend-icon="timer.paused ? 'mdi-play' : 'mdi-pause'"
          variant="tonal"
        >{{ timer.paused ? 'Resume' : 'Pause' }}</v-btn>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import audioBell from '../assets/bell.mp3'
import audioRain from '../assets/rain_forest.mp3'
import { calcTimerState, shouldDing, sendTimerNotification } from '../utils/pomodoro'
import { useTimerStore } from '../stores/timer'
import { useSettingsStore } from '../stores/settings'

const timer = useTimerStore()
const settings = useSettingsStore()

const audioMap: Record<string, string> = {
  bell: audioBell,
  rain: audioRain,
}

const intervalHandle = ref<ReturnType<typeof setInterval> | null>(null)
const timeLast = ref('')
const timeLeft = ref('')
const progress = ref(0)
const isDone = ref(false)
const progressBarColor = ref('indigo')
const currentAudio = ref<HTMLAudioElement | null>(null)

function stopCurrentAudio() {
  if (currentAudio.value) {
    currentAudio.value.pause()
    currentAudio.value.currentTime = 0
    currentAudio.value = null
  }
}

async function requestNotificationPermission(): Promise<void> {
  if (!('Notification' in window) || Notification.permission !== 'default') return
  await Notification.requestPermission()
}

function advance() {
  stopCurrentAudio()
  if (typeof window.umami !== 'undefined') {
    window.umami.track('Next', { session_type: timer.typeLabel })
  }
  timer.advance()
  isDone.value = false
  progressBarColor.value = 'indigo'
}

function togglePause() {
  if (!timer.paused) stopCurrentAudio()
  timer.togglePause()
}

function fullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

function tick() {
  if (timer.paused) return
  const diffMs = new Date().getTime() - timer.timestamp.getTime()
  const state = calcTimerState(diffMs, timer.duration)
  timeLeft.value = state.left
  timeLast.value = state.last
  progress.value = state.progress
  isDone.value = state.done
  if (state.done) {
    progressBarColor.value = 'success'
    if (timer.dingCount === 0) {
      sendTimerNotification(timer.type as 'L' | 'S')
    }
    if (shouldDing(timer.dingCount, settings.dingInterval)) {
      const src = audioMap[settings.alertSound] ?? audioBell
      stopCurrentAudio()
      currentAudio.value = new Audio(src)
      currentAudio.value.play()
    }
    timer.dingCount++
  }
}

onMounted(() => {
  intervalHandle.value = setInterval(tick, 1000)
  requestNotificationPermission()
})

onUnmounted(() => {
  if (intervalHandle.value) clearInterval(intervalHandle.value)
})
</script>

<style scoped>
.timer-card {
  width: 100%;
  max-width: 560px;
}

.timer-digit {
  width: 3.2rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
</style>
