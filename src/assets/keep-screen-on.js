
export default {
  toggleWakeLock () {
    if ('getWakeLock' in navigator) {
      console.log('ok', 'navigator.getWakeLock is supported')
    } else {
      console.warn('navigator.getWakeLock is not supported')
    }
    if ('WakeLock' in window && 'request' in window.WakeLock) {
      this.bar = 'wake in WakeLock'
    }

    if ('wakeLock' in navigator && 'request' in navigator.wakeLock) {
      this.bar = 'wake in wakeLock'
    }
  }
}
