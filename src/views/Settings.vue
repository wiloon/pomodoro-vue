<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title>Alert Sound</v-card-title>
          <v-card-text>
            <v-radio-group v-model="settings.alertSound" label="Select alert sound">
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
            >
              {{ previewing ? 'Stop' : 'Preview' }}
            </v-btn>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title>Ding Interval</v-card-title>
          <v-card-text>
            <div class="d-flex align-center ga-3">
              <v-btn icon="mdi-minus" variant="tonal" @click="settings.dingInterval > 2 && settings.dingInterval--" />
              <span class="text-h6">{{ settings.dingInterval }} sec</span>
              <v-btn icon="mdi-plus" variant="tonal" @click="settings.dingInterval < 300 && settings.dingInterval++" />
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
import { useSettingsStore } from '../stores/settings'

const settings = useSettingsStore()

const soundOptions = [
  { label: 'Bell', value: 'bell' },
  { label: 'Rain Forest', value: 'rain' },
]

const audioMap: Record<string, string> = {
  bell: audioBell,
  rain: audioRain,
}

const previewing = ref(false)
let currentAudio: HTMLAudioElement | null = null

function togglePreview() {
  if (previewing.value) {
    currentAudio?.pause()
    if (currentAudio) currentAudio.currentTime = 0
    currentAudio = null
    previewing.value = false
  } else {
    const src = audioMap[settings.alertSound] ?? audioBell
    currentAudio = new Audio(src)
    currentAudio.play()
    previewing.value = true
    currentAudio.addEventListener('ended', () => {
      previewing.value = false
      currentAudio = null
    })
  }
}
</script>
