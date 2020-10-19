export function foo () {
  console.log('foo')
  if ('getWakeLock' in navigator) {
    console.log('ok', 'navigator.getWakeLock is supported')
    try {
      const wakeLock = navigator.getWakeLock('screen')
      wakeLock.addEventListener('activechange', (e) => {
        console.log('active change:' + e)
      })
      wakeLock.createRequest()
    } catch (ex) {
      console.error(ex)
    }
  } else {
    console.log('navigator.getWakeLock is not supported')
  }
  if ('WakeLock' in window && 'request' in window.WakeLock) {
    console.log('WakeLock')
    const controller = new AbortController()
    const signal = controller.signal
    window.WakeLock.request('screen', { signal })
      .catch((e) => {
        if (e.name === 'AbortError') {
          console.log('Wake Lock was aborted')
        } else {
          console.error(`${e.name}, ${e.message}`)
        }
      })
    console.log('Wake Lock is active')
  } else {
    console.log('no WakeLock')
  }

  if ('wakeLock' in navigator && 'request' in navigator.wakeLock) {
    console.log('wakeLock')
    try {
      const wakeLock = navigator.wakeLock.request('screen')
      wakeLock.addEventListener('release', (e) => {
        console.log(e)
        console.log('Wake Lock was released')
      })
      console.log('Wake Lock is active')
    } catch (e) {
      console.error(`${e.name}, ${e.message}`)
    }
  } else {
    console.log('no wakeLock')
  }
}
