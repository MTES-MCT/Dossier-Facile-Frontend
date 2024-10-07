export default {
  install(app) {
    // Init Beacon
    function initializeBeacon() {
      var e = document.getElementsByTagName('script')[0],
        n = document.createElement('script')
      ;(n.type = 'text/javascript'),
        (n.async = !0),
        (n.src = 'https://beacon-v2.helpscout.net'),
        e.parentNode.insertBefore(n, e)
    }

    // Create Global Beacon
    window.Beacon = function (t, n, a) {
      window.Beacon.readyQueue.push({ method: t, options: n, data: a })
    }

    window.Beacon.readyQueue = []

    if (document.readyState === 'complete') {
      initializeBeacon()
    } else {
      window.addEventListener
        ? window.addEventListener('load', initializeBeacon, false)
        : window.attachEvent && window.attachEvent('onload', initializeBeacon)
    }
  }
}
