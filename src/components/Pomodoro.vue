<template>
  <v-container>
    <p>Type: {{ type }}</p>
    <p>Start: {{ timestampStr }}</p>
    <v-row align="center" no-gutters>
      <v-col cols="auto" class="pr-4" data-testid="timer-elapsed">{{ pomodoroTimeLast }}</v-col>
      <v-col>
        <v-progress-linear
          :model-value="progress"
          :indeterminate="indeterminateValue"
          :color="progressBarColor"
        />
      </v-col>
      <v-col cols="auto" class="pl-4" data-testid="timer-remaining">{{ pomodoroTimeLeft }}</v-col>
    </v-row>
    <v-row>
      <v-btn @click="tick" :color="tickBtnColor" class="p-button">tick</v-btn>
      <v-btn @click="fullScreen" class="p-button">Full Screen</v-btn>
      <v-btn @click="startStop" class="p-button">{{ switchLabel }}</v-btn>
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
const timestampStr = ref(timestamp.value.toLocaleString())
const timer = ref<ReturnType<typeof setInterval> | null>(null)
const type = ref('L')
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
const switchLabel = ref('Stop')

function startStop() {
  if (stop.value) {
    stop.value = false
    switchLabel.value = 'Stop'
  } else {
    stop.value = true
    switchLabel.value = 'Start'
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
  timestampStr.value = timestamp.value.toLocaleString()
  pomodoroTimeLast.value = '0'
  type.value = nextTickType(type.value)
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
