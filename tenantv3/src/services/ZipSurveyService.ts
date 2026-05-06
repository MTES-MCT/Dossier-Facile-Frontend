const TYPEFORM_FORM_ID =
  import.meta.env.VITE_ZIP_SURVEY_TYPEFORM_ID ?? 'JQFIjNOI'

const TYPEFORM_EMBED_SRC = 'https://embed.typeform.com/next/embed.js'
const TYPEFORM_POPUP_CSS = 'https://embed.typeform.com/next/css/popup.css'

type TypeformPopup = { open: () => void }
type TypeformGlobal = { createPopup: (id: string) => TypeformPopup }

let scriptPromise: Promise<void> | null = null
let cssLoaded = false

function loadPopupCss() {
  if (cssLoaded) return
  cssLoaded = true
  if (document.querySelector(`link[href="${TYPEFORM_POPUP_CSS}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = TYPEFORM_POPUP_CSS
  document.head.appendChild(link)
}

function loadScript(): Promise<void> {
  if (scriptPromise) {
    return scriptPromise
  }
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TYPEFORM_EMBED_SRC}"]`
    )
    if (existing) {
      if ((window as unknown as { tf?: TypeformGlobal }).tf) {
        resolve()
      } else {
        existing.addEventListener('load', () => resolve(), { once: true })
        existing.addEventListener(
          'error',
          () => {
            scriptPromise = null
            reject(new Error('Typeform embed script failed to load'))
          },
          { once: true }
        )
      }
      return
    }
    const script = document.createElement('script')
    script.src = TYPEFORM_EMBED_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('Typeform embed script failed to load'))
    }
    document.body.appendChild(script)
  })
  return scriptPromise
}

export async function openZipSurveyPopup(): Promise<void> {
  loadPopupCss()
  await loadScript()
  const tf = (window as unknown as { tf?: TypeformGlobal }).tf
  tf?.createPopup(TYPEFORM_FORM_ID).open()
}
