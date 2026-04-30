<template>
  <v-container>
    <p class="text-h6 mb-1">{{ typeLabel }}</p>
    <p class="text-caption text-medium-emphasis mb-4">Started {{ startTimeStr }}</p>
    <v-row align="center" no-gutters class="mb-6">
      <v-col cols="auto" class="pr-6" data-testid="timer-elapsed">{{ pomodoroTimeLast }}</v-col>
      <v-col style="min-width: 0; padding-right: 24px">
        <v-progress-linear
          :model-value="progress"
          :indeterminate="indeterminateValue"
          :color="progressBarColor"
        />
      </v-col>
      <v-col cols="auto" data-testid="timer-remaining">{{ pomodoroTimeLeft }}</v-col>
    </v-row>
    <v-row>
      <v-btn @click="tick" :color="tickBtnColor" prepend-icon="mdi-skip-next" class="p-button">Next</v-btn>
      <v-btn @click="fullScreen" prepend-icon="mdi-fullscreen" class="p-button">Full Screen</v-btn>
      <v-btn @click="startStop" :color="switchBtnColor" :prepend-icon="switchIcon" variant="tonal" class="p-button">{{ switchLabel }}</v-btn>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import audioBell from '../assets/bell.mp3'
import audioRain from '../assets/rain_forest.mp3'
import { calcTimerState, shouldDing, nextTickType, durationForType } from '../utils/pomodoro'

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
const dingCount = ref(0)
const stop = ref(false)
const switchLabel = ref('Pause')
const switchIcon = ref('mdi-pause')
const switchBtnColor = ref(undefined as string | undefined)

function startStop() {
  if (stop.value) {
    stop.value = false
    switchLabel.value = 'Pause'
    switchIcon.value = 'mdi-pause'
    switchBtnColor.value = undefined
  } else {
    stop.value = true
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
  timestamp.value = new Date()
  startTimeStr.value = timestamp.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  pomodoroTimeLast.value = '0'
  type.value = nextTickType(type.value)
  typeLabel.value = type.value === 'L' ? 'Focus' : 'Break'
  duration.value = durationForType(type.value)
  pomodoroTimeLeft.value = String(duration.value)
  tickBtnColor.value = 'primary'
  progressBarColor.value = 'indigo'
  indeterminateValue.value = false
}

function updateTimestamp() {
  if (stop.value) return
  const diffMs = new Date().getTime() - timestamp.value.getTime()
  const state = calcTimerState(diffMs, duration.value)
  pomodoroTimeLeft.value = state.left
  pomodoroTimeLast.value = state.last
  progress.value = state.progress
  if (state.done) {
    if (shouldDing(dingCount.value, parseInt(localStorage.getItem(DING_INTERVAL_KEY) ?? '10', 10))) {
      const soundKey = localStorage.getItem(STORAGE_KEY) ?? 'bell'
      const src = audioMap[soundKey] ?? audioBell
      const ding = new Audio(src)
      ding.play()
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
.p-button {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
