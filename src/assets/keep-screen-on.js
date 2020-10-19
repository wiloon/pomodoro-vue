export function wakeLock () {
  if ('wakeLock' in navigator && 'request' in navigator.wakeLock) {
    console.log('wakeLock supported')
    try {
      navigator.wakeLock.request('screen')
      console.log('Wake Lock is active')
    } catch (e) {
      console.error(`${e.name}, ${e.message}`)
    }
  } else {
    console.log('no wakeLock support')
  }
}
