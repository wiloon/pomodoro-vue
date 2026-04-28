<template>
  <v-container>
    <p>Type: {{ type }}</p>
    <p>Start: {{ timestampStr }}</p>
    <v-row>
      <v-col cols="1">{{ pomodoroTimeLast }}</v-col>
      <v-col cols="9">
        <v-progress-linear
          :model-value="progress"
          :indeterminate="indeterminateValue"
          :color="progressBarColor"
        />
      </v-col>
      <v-col cols="2">{{ pomodoroTimeLeft }}</v-col>
    </v-row>
    <v-row>
      <v-btn @click="tick" :color="tickBtnColor" class="p-button">tick</v-btn>
      <v-btn @click="fullScreen" class="p-button">Full Screen</v-btn>
      <v-btn @click="decreaseDingInterval" class="p-button">-</v-btn>
      <v-btn @click="increaseDingInterval" class="p-button">+</v-btn>
      Ding Interval: {{ dingInterval }}
      <v-btn @click="startStop" class="p-button">{{ switchLabel }}</v-btn>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import audio0 from '../assets/y1115.mp3'

const typeLong = 'L'
const typeShort = 'S'

const timestamp = ref(new Date())
const timestampStr = ref(timestamp.value.toLocaleString())
const timer = ref<ReturnType<typeof setInterval> | null>(null)
const type = ref(typeLong)
const pomodoroTimeLast = ref('')
const pomodoroTimeLeft = ref('')
const tickBtnColor = ref('primary')
const duration = ref(25)
const progress = ref(0)
const indeterminateValue = ref(false)
const progressBarColor = ref('indigo')
const dingCount = ref(0)
const dingInterval = ref(10)
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

function decreaseDingInterval() {
  if (dingInterval.value > 2) dingInterval.value--
}

function increaseDingInterval() {
  if (dingInterval.value < 100) dingInterval.value++
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
  pomodoroTimeLeft.value = String(duration.value)
  if (type.value === '' || type.value === typeShort) {
    type.value = typeLong
    duration.value = 25
  } else {
    type.value = typeShort
    duration.value = 5
  }
  tickBtnColor.value = 'primary'
  progressBarColor.value = 'indigo'
  indeterminateValue.value = false
}

function updateTimestamp() {
  if (stop.value) return
  const diff = new Date().getTime() - timestamp.value.getTime()
  const last = diff / (1000 * 60)
  const left = duration.value - last
  if (left > 0) {
    pomodoroTimeLeft.value = left.toFixed(2)
    pomodoroTimeLast.value = last.toFixed(2)
    progress.value = (last / duration.value) * 100
  } else {
    pomodoroTimeLeft.value = '0'
    pomodoroTimeLast.value = String(duration.value)
    if (dingCount.value % dingInterval.value === 0) {
      const ding = new Audio(audio0)
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
