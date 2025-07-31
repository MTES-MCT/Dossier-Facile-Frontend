import { i18n } from '@/i18n'
import type { DsfrAlertType } from '@gouvminint/vue-dsfr'
import { reactive } from 'vue'

type MaybeElement = HTMLElement | null | undefined
type GetElement = () => MaybeElement

type Alert = {
  type: DsfrAlertType
  label: string
  id: number
  elt: MaybeElement | GetElement
  keep: boolean
}
let count = 0

export const alerts = reactive<Alert[]>([])

const MAX_ALERTS_SHOWN = 4

function show(type: DsfrAlertType, label: string, elt: MaybeElement): void
function show(type: DsfrAlertType, label: string, elt: GetElement, keep: true): void
function show(type: DsfrAlertType, label: string, elt: MaybeElement | GetElement, keep = false) {
  alerts.push({ type, label, id: count++, elt, keep })
  if (alerts.length > MAX_ALERTS_SHOWN) {
    alerts.splice(0, 1)
  }
}

export function removeToast(alert: Alert) {
  const index = alerts.findIndex((a) => a.id === alert.id)
  alerts.splice(index, 1)
  const elt = typeof alert.elt === 'function' ? alert.elt() : alert.elt
  elt?.focus()
}

export function clearAllToasts() {
  for (const alert of alerts.filter((a) => !a.keep)) {
    const index = alerts.findIndex((a) => a.id === alert.id)
    alerts.splice(index, 1)
  }
  for (const alert of alerts) {
    alert.keep = false
  }
}

export const getNextBtnInFooter = () =>
  document.querySelector<HTMLButtonElement>(
    '#footer-navigation button.fr-btn:not(.fr-btn--secondary)'
  )

export const toast = {
  error(label: string, elt: MaybeElement) {
    show('error', label, elt)
  },
  info(label: string, elt: MaybeElement) {
    show('info', label, elt)
  },
  success(label: string, elt: MaybeElement) {
    show('success', label, elt)
  },
  warning(label: string, elt: MaybeElement) {
    show('warning', label, elt)
  },
  keep: {
    error(label: string, elt: GetElement) {
      show('error', label, elt, true)
    },
    info(label: string, elt: GetElement) {
      show('info', label, elt, true)
    },
    success(label: string, elt: GetElement) {
      show('success', label, elt, true)
    },
    warning(label: string, elt: GetElement) {
      show('warning', label, elt, true)
    }
  },
  deleteSuccess() {
    show('success', i18n.global.t('delete-success'), document.getElementById('file'))
  },
  deleteFileFailed() {
    show('error', i18n.global.t('delete-file-failed'), document.getElementById('file'))
  },
  maxFileError(value: number, max: number, elt: MaybeElement) {
    show('error', i18n.global.t('max-file', [value, max]), elt)
  }
}
