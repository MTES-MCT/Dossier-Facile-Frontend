import { i18n } from '@/i18n'
import type { DsfrAlertType } from '@gouvminint/vue-dsfr'
import { reactive } from 'vue'

type Alert = {
  type: DsfrAlertType
  label: string
  id: number
  elt: HTMLElement | null
}
let count = 0

export const alerts = reactive<Alert[]>([])

const MAX_ALERTS_SHOWN = 4

function show(type: DsfrAlertType, label: string, elt: HTMLElement | null) {
  alerts.push({ type, label, id: count++, elt })
  if (alerts.length > MAX_ALERTS_SHOWN) {
    alerts.splice(0, 1)
  }
}

export function removeToast(alert: Alert) {
  const index = alerts.findIndex((a) => a.id === alert.id)
  alerts.splice(index, 1)
  alert.elt?.focus()
}

export function clearAllToasts() {
  alerts.splice(0, alerts.length)
}

export const toast = {
  error(label: string, elt: HTMLElement | null) {
    show('error', label, elt)
  },
  info(label: string, elt: HTMLElement | null) {
    show('info', label, elt)
  },
  success(label: string, elt: HTMLElement | null) {
    show('success', label, elt)
  },
  warning(label: string, elt: HTMLElement | null) {
    show('warning', label, elt)
  },
  deleteSuccess() {
    show('success', i18n.global.t('delete-success'), document.getElementById('file'))
  },
  deleteFileFailed() {
    show('error', i18n.global.t('delete-file-failed'), document.getElementById('file'))
  }
}
