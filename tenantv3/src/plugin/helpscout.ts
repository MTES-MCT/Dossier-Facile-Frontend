export default {
  install() {
    // Init Beacon
    function initializeBeacon() {
      const e = document.getElementsByTagName('script')[0],
        n = document.createElement('script')
      ;(n.type = 'text/javascript'),
        (n.async = !0),
        (n.src = 'https://beacon-v2.helpscout.net'),
        e?.parentNode?.insertBefore(n, e)
    }

    // Create Global Beacon
    window.Beacon = Object.assign(
      function (t: string, n?: string, a?: unknown) {
        window.Beacon.readyQueue.push({ method: t, options: n, data: a })
      },
      { readyQueue: [] }
    )

    if (document.readyState === 'complete') {
      initializeBeacon()
    } else {
      window.addEventListener('load', initializeBeacon, false)
    }
  }
}
