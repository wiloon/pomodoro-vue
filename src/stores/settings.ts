import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const ALERT_SOUND_KEY = 'pomodoro-alert-sound'
const DING_INTERVAL_KEY = 'pomodoro-ding-interval'

export const useSettingsStore = defineStore('settings', () => {
  const alertSound = ref(localStorage.getItem(ALERT_SOUND_KEY) ?? 'bell')
  const dingInterval = ref(parseInt(localStorage.getItem(DING_INTERVAL_KEY) ?? '10', 10))

  watch(alertSound, (val) => localStorage.setItem(ALERT_SOUND_KEY, val))
  watch(dingInterval, (val) => localStorage.setItem(DING_INTERVAL_KEY, String(val)))

  return { alertSound, dingInterval }
})
