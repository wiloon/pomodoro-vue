let wakeLock
let wakeLockRequest

function updateStatus (wakeLock) {
  console.log(wakeLock)
}

async function toggleWakeLock () {
  if ('getWakeLock' in navigator) {
    console.log('👍', 'navigator.getWakeLock is supported')
    try {
      wakeLock = await navigator.getWakeLock('screen')
      updateStatus(wakeLock)
      // Listen for changes to the wakeLock
      wakeLock.addEventListener('activechange', (e) => {
        updateStatus(wakeLock)
      })
      wakeLockRequest = wakeLock.createRequest()
    } catch (ex) {
      console.error(ex)
    }
  } else {
    console.warn('navigator.getWakeLock is not supported')
  }
}
