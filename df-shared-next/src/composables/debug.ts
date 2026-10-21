declare global {
  interface Window {
    DEBUG?: boolean
    enableDebug?: () => void
    disableDebug?: () => void
  }
}

if (typeof window !== 'undefined') {
  window.enableDebug = () => {
    window.DEBUG = true
    console.log('🔧 Debug enabled')
  }
  window.disableDebug = () => {
    window.DEBUG = false
    console.log('🔧 Debug disabled')
  }
}

const isEnabled = () =>
  typeof window !== 'undefined' &&
  (location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1' ||
    location.search.includes('debug=true') ||
    window.DEBUG === true)

export class DebugLogger {
  private prefix: string

  private styles = {
    info: 'color: #6366f1; font-weight: bold;',
    warn: 'color: #f59e0b; font-weight: bold;',
    error: 'color: #dc2626; font-weight: bold;',
    reset: 'color: inherit;'
  }

  constructor(prefix: string) {
    this.prefix = prefix
  }

  private format(
    level: keyof typeof this.styles,
    message: string,
    data: unknown = null
  ): unknown[] {
    const style = this.styles[level]
    if (data !== null) {
      return [`%c[${this.prefix}]%c ${message}`, style, this.styles.reset, data]
    }
    return [`%c[${this.prefix}]%c ${message}`, style, this.styles.reset]
  }

  log(message: string, data: unknown = null) {
    if (!isEnabled()) return
    console.log(...this.format('info', message, data))
  }

  warn(message: string, data: unknown = null) {
    if (!isEnabled()) return
    console.warn(...this.format('warn', message, data))
  }

  error(message: string, data: unknown = null) {
    if (!isEnabled()) return
    console.error(...this.format('error', message, data))
  }
}
