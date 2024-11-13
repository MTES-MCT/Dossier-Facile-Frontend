import type { App } from 'vue'

declare global {
  interface Window {
    $crisp: unknown[] & { is?: (method: string) => boolean }
    CRISP_WEBSITE_ID: string
  }
}

export default {
  install(app: App, options: { websiteId: string }) {
    window.$crisp = [
      ['safe', true],
      [
        'on',
        'chat:opened',
        () => {
          if (!window.$crisp.is?.('session:ongoing')) {
            window.$crisp.push(['do', 'helpdesk:search'])
          }
        }
      ]
    ]
    window.CRISP_WEBSITE_ID = options.websiteId

    const d = document
    const s = d.createElement('script')
    s.src = 'https://client.crisp.chat/l.js'
    s.async = true
    d.getElementsByTagName('head')[0].appendChild(s)
  }
}
