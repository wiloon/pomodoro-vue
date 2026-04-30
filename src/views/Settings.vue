<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title>Alert Sound</v-card-title>
          <v-card-text>
            <v-radio-group v-model="selectedSound" label="Select alert sound">
              <v-radio
                v-for="sound in soundOptions"
                :key="sound.value"
                :label="sound.label"
                :value="sound.value"
              />
            </v-radio-group>
            <v-btn
              @click="togglePreview"
              :prepend-icon="previewing ? 'mdi-stop' : 'mdi-play'"
              variant="tonal"
              class="mr-3"
            >
              {{ previewing ? 'Stop' : 'Preview' }}
            </v-btn>
            <v-btn @click="saveSound" color="primary">
              Save
            </v-btn>
            <v-fade-transition>
              <span v-if="savedSound" class="ml-3 text-success text-caption">Saved</span>
            </v-fade-transition>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title>Ding Interval</v-card-title>
          <v-card-text>
            <div class="d-flex align-center ga-3">
              <v-btn icon="mdi-minus" variant="tonal" @click="decreaseDingInterval" />
              <span class="text-h6">{{ dingInterval }} sec</span>
              <v-btn icon="mdi-plus" variant="tonal" @click="increaseDingInterval" />
              <v-btn @click="saveDingInterval" color="primary" class="ml-2">Save</v-btn>
              <v-fade-transition>
                <span v-if="savedInterval" class="text-success text-caption">Saved</span>
              </v-fade-transition>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import audioBell from '../assets/bell.mp3'
import audioRain from '../assets/rain_forest.mp3'

const STORAGE_KEY = 'pomodoro-alert-sound'
const DING_INTERVAL_KEY = 'pomodoro-ding-interval'

const soundOptions = [
  { label: 'Bell', value: 'bell' },
  { label: 'Rain Forest', value: 'rain' },
]

const audioMap: Record<string, string> = {
  bell: audioBell,
  rain: audioRain,
}

const selectedSound = ref(localStorage.getItem(STORAGE_KEY) ?? 'bell')
const previewing = ref(false)
const savedSound = ref(false)
const dingInterval = ref(parseInt(localStorage.getItem(DING_INTERVAL_KEY) ?? '10', 10))
const savedInterval = ref(false)
let currentAudio: HTMLAudioElement | null = null

function togglePreview() {
  if (previewing.value) {
    currentAudio?.pause()
    if (currentAudio) currentAudio.currentTime = 0
    currentAudio = null
    previewing.value = false
  } else {
    const src = audioMap[selectedSound.value] ?? audioBell
    currentAudio = new Audio(src)
    currentAudio.play()
    previewing.value = true
    currentAudio.addEventListener('ended', () => {
      previewing.value = false
      currentAudio = null
    })
  }
}

function saveSound() {
  localStorage.setItem(STORAGE_KEY, selectedSound.value)
  savedSound.value = true
  setTimeout(() => { savedSound.value = false }, 2000)
}

function decreaseDingInterval() {
  if (dingInterval.value > 2) dingInterval.value--
}

function increaseDingInterval() {
  if (dingInterval.value < 300) dingInterval.value++
}

function saveDingInterval() {
  localStorage.setItem(DING_INTERVAL_KEY, String(dingInterval.value))
  savedInterval.value = true
  setTimeout(() => { savedInterval.value = false }, 2000)
}
</script>
