
export default {
  toggleWakeLock () {
    if ('getWakeLock' in navigator) {
      console.log('👍', 'navigator.getWakeLock is supported')
    } else {
      console.warn('navigator.getWakeLock is not supported')
    }
  }
}
