export default {
  install(app, options) {
    window.$crisp = []
    window.CRISP_WEBSITE_ID = options.websiteId

    const d = document
    const s = d.createElement('script')
    s.src = 'https://client.crisp.chat/l.js'
    s.async = 1
    d.getElementsByTagName('head')[0].appendChild(s)
  }
}
