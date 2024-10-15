import type { App } from 'vue'

declare global {
  interface Window {
    $crisp: unknown[]
    CRISP_WEBSITE_ID: string
  }
}

export default {
  install(app: App, options: { websiteId: string }) {
    window.$crisp = []
    window.CRISP_WEBSITE_ID = options.websiteId

    const d = document
    const s = d.createElement('script')
    s.src = 'https://client.crisp.chat/l.js'
    s.async = true
    d.getElementsByTagName('head')[0].appendChild(s)
  }
}
