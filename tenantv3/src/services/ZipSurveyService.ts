import { createPopup } from '@typeform/embed'
import '@typeform/embed/build/css/popup.css'

const TYPEFORM_FORM_ID =
  import.meta.env.VITE_ZIP_SURVEY_TYPEFORM_ID ?? 'JQFIjNOI'

const isIOS =
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (/Mac/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1)

export function openZipSurveyPopup() {
  if (isIOS) return
  createPopup(TYPEFORM_FORM_ID).open()
}
