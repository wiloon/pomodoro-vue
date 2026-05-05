<template>
  <v-container class="d-flex justify-center">
    <div class="timer-card">
      <p class="text-h5 font-weight-medium mb-1 text-center">{{ typeLabel }}</p>
      <p class="text-caption text-medium-emphasis mb-1 text-center">Started {{ startTimeStr }}</p>
      <p class="text-caption text-medium-emphasis mb-6 text-center">
        Session {{ sessionCount }} &nbsp;·&nbsp; Today {{ todayCount }}
      </p>
      <v-row align="center" no-gutters class="mb-8">
        <v-col cols="auto" class="pr-4 text-body-2 timer-digit" data-testid="timer-elapsed">{{ pomodoroTimeLast }}</v-col>
        <v-col style="min-width: 0">
          <v-progress-linear
            :model-value="progress"
            :indeterminate="indeterminateValue"
            :color="progressBarColor"
            rounded
            height="6"
          />
        </v-col>
        <v-col cols="auto" class="pl-4 text-body-2 timer-digit" data-testid="timer-remaining">{{ pomodoroTimeLeft }}</v-col>
      </v-row>
      <v-row justify="center" no-gutters class="ga-3">
        <v-btn @click="tick" :color="tickBtnColor" prepend-icon="mdi-skip-next">Next</v-btn>
        <v-btn @click="fullScreen" prepend-icon="mdi-fullscreen">Full Screen</v-btn>
        <v-btn @click="startStop" :color="switchBtnColor" :prepend-icon="switchIcon" variant="tonal">{{ switchLabel }}</v-btn>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import audioBell from '../assets/bell.mp3'
import audioRain from '../assets/rain_forest.mp3'
import { calcTimerState, shouldDing, nextTickType, durationForType, sendTimerNotification } from '../utils/pomodoro'

const STORAGE_KEY = 'pomodoro-alert-sound'

const audioMap: Record<string, string> = {
  bell: audioBell,
  rain: audioRain,
}

const timestamp = ref(new Date())
const startTimeStr = ref(timestamp.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
const timer = ref<ReturnType<typeof setInterval> | null>(null)
const type = ref('L')
const typeLabel = ref('Focus')
const pomodoroTimeLast = ref('')
const pomodoroTimeLeft = ref('')
const tickBtnColor = ref('primary')
const duration = ref(25)
const progress = ref(0)
const indeterminateValue = ref(false)
const progressBarColor = ref('indigo')
const DING_INTERVAL_KEY = 'pomodoro-ding-interval'
const SESSION_COUNT_KEY = 'pomodoro-session-count'
const SESSION_CURRENT_KEY = 'pomodoro-session-current'
const SESSION_DATE_KEY = 'pomodoro-session-date'
const dingCount = ref(0)

function loadTodayCount(): number {
  const today = new Date().toDateString()
  if (localStorage.getItem(SESSION_DATE_KEY) !== today) {
    localStorage.setItem(SESSION_DATE_KEY, today)
    localStorage.setItem(SESSION_COUNT_KEY, '0')
    localStorage.setItem(SESSION_CURRENT_KEY, '1')
  }
  return parseInt(localStorage.getItem(SESSION_COUNT_KEY) ?? '0', 10)
}

function loadSessionCount(): number {
  const today = new Date().toDateString()
  if (localStorage.getItem(SESSION_DATE_KEY) !== today) return 1
  return parseInt(localStorage.getItem(SESSION_CURRENT_KEY) ?? '1', 10)
}

const sessionCount = ref(loadSessionCount())
const todayCount = ref(loadTodayCount())
const currentAudio = ref<HTMLAudioElement | null>(null)
const stop = ref(false)
const switchLabel = ref('Pause')
const switchIcon = ref('mdi-pause')
const switchBtnColor = ref(undefined as string | undefined)

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

async function startStop() {
  if (stop.value) {
    stop.value = false
    switchLabel.value = 'Pause'
    switchIcon.value = 'mdi-pause'
    switchBtnColor.value = undefined
    await requestNotificationPermission()
  } else {
    stop.value = true
    stopCurrentAudio()
    switchLabel.value = 'Resume'
    switchIcon.value = 'mdi-play'
    switchBtnColor.value = 'warning'
  }
}

function fullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

function tick() {
  stopCurrentAudio()
  // only count completed Focus sessions
  if (type.value === 'L') {
    const today = new Date().toDateString()
    if (localStorage.getItem(SESSION_DATE_KEY) !== today) {
      localStorage.setItem(SESSION_DATE_KEY, today)
      localStorage.setItem(SESSION_COUNT_KEY, '0')
    }
    const next = parseInt(localStorage.getItem(SESSION_COUNT_KEY) ?? '0', 10) + 1
    localStorage.setItem(SESSION_COUNT_KEY, String(next))
    todayCount.value = next
  }
  const nextSession = sessionCount.value + 1
  sessionCount.value = nextSession
  localStorage.setItem(SESSION_CURRENT_KEY, String(nextSession))
  timestamp.value = new Date()
  startTimeStr.value = timestamp.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  pomodoroTimeLast.value = '0'
  dingCount.value = 0
  type.value = nextTickType(type.value)
  typeLabel.value = type.value === 'L' ? 'Focus' : 'Break'
  duration.value = durationForType(type.value)
  pomodoroTimeLeft.value = String(duration.value)
  tickBtnColor.value = 'primary'
  progressBarColor.value = 'indigo'
  indeterminateValue.value = false
  if (typeof window.umami !== 'undefined') {
    window.umami.track('Next', { session_type: typeLabel.value })
  }
}

function updateTimestamp() {
  if (stop.value) return
  const diffMs = new Date().getTime() - timestamp.value.getTime()
  const state = calcTimerState(diffMs, duration.value)
  pomodoroTimeLeft.value = state.left
  pomodoroTimeLast.value = state.last
  progress.value = state.progress
  if (state.done) {
    if (dingCount.value === 0) {
      sendTimerNotification(type.value as 'L' | 'S')
    }
    if (shouldDing(dingCount.value, parseInt(localStorage.getItem(DING_INTERVAL_KEY) ?? '10', 10))) {
      const soundKey = localStorage.getItem(STORAGE_KEY) ?? 'bell'
      const src = audioMap[soundKey] ?? audioBell
      stopCurrentAudio()
      currentAudio.value = new Audio(src)
      currentAudio.value.play()
    }
    dingCount.value++
  }
}

onMounted(() => {
  timer.value = setInterval(updateTimestamp, 1000)
})

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
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
