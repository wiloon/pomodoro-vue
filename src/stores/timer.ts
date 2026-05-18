import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { nextTickType, durationForType } from '../utils/pomodoro'

const SESSION_COUNT_KEY = 'pomodoro-session-count'
const SESSION_CURRENT_KEY = 'pomodoro-session-current'
const SESSION_DATE_KEY = 'pomodoro-session-date'

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

export const useTimerStore = defineStore('timer', () => {
  const type = ref('L')
  const timestamp = ref(new Date())
  const paused = ref(false)
  const sessionCount = ref(loadSessionCount())
  const todayCount = ref(loadTodayCount())
  const dingCount = ref(0)

  const typeLabel = computed(() => type.value === 'L' ? 'Focus' : 'Break')
  const duration = computed(() => durationForType(type.value))
  const startTimeStr = computed(() =>
    timestamp.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  )

  function advance() {
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
    type.value = nextTickType(type.value)
    timestamp.value = new Date()
    dingCount.value = 0
  }

  function togglePause() {
    paused.value = !paused.value
  }

  return {
    type, timestamp, paused, sessionCount, todayCount, dingCount,
    typeLabel, duration, startTimeStr,
    advance, togglePause,
  }
})
