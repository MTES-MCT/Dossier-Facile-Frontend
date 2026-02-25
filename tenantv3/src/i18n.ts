import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import fr from './locales/fr.json'
import base from './locales/base.json'

const datetimeFormats = {
  en: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
  },
  fr: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric'
    }
  }
} as const

export const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  globalInjection: true,
  messages: {
    en: { ...base, ...en },
    fr: { ...base, ...fr }
  },
  datetimeFormats
})
