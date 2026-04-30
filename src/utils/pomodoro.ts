export function calcTimerState(diffMs: number, durationMin: number) {
  const last = diffMs / (1000 * 60)
  const left = durationMin - last
  if (left > 0) {
    return {
      done: false,
      left: left.toFixed(2),
      last: last.toFixed(2),
      progress: (last / durationMin) * 100,
    }
  }
  return {
    done: true,
    left: '0',
    last: String(durationMin),
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
