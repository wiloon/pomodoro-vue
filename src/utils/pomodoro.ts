// Timer session types:
//   'L' = Long (Focus) session — 25 minutes
//   'S' = Short (Break) session — 5 minutes

function formatMinSec(minutes: number): string {
  const totalSec = Math.floor(minutes * 60)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function calcTimerState(diffMs: number, durationMin: number) {
  const last = diffMs / (1000 * 60)
  const left = durationMin - last
  if (left > 0) {
    return {
      done: false,
      left: formatMinSec(left),
      last: formatMinSec(last),
      progress: (last / durationMin) * 100,
    }
  }
  return {
    done: true,
    left: '0:00',
    last: formatMinSec(durationMin),
    progress: 100,
  }
}

export function shouldDing(dingCount: number, dingInterval: number) {
  return dingCount % dingInterval === 0
}

export function nextTickType(currentType: string) {
  return currentType === 'S' ? 'L' : 'S'
}

export function durationForType(type: string) {
  return type === 'L' ? 25 : 5
}

export function sendTimerNotification(type: 'L' | 'S'): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  const title = type === 'L' ? 'Focus ended' : 'Break ended'
  const body = type === 'L' ? 'Time for a break!' : 'Ready to focus?'
  try {
    new Notification(title, { body, icon: '/favicon.ico' })
  } catch {
    // ignore
  }
}
