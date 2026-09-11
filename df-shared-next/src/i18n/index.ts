import type { Ref } from "vue"
import { createI18n } from 'vue-i18n'

// define available locales
export const locales = ['fr', 'en'] as const
export type Locale = typeof locales[number]

// set default options
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

// i18n factory
export function createAppI18n<T extends Record<string, any>>(
  messages: T,
  initialLocale: Locale = 'fr',
) {
  const i18n = createI18n({
    legacy: false,
    locale: initialLocale,
    fallbackLocale: 'fr',
    globalInjection: true,
    messages,
    datetimeFormats
  })

  const changeLang = (lang: Locale) => {
    i18n.global.locale.value = lang
    i18n.global.fallbackLocale.value = 'fr'

    document.documentElement.lang = lang
    localStorage.setItem('lang', lang)
  }

  return {
    i18n,
    locale: i18n.global.locale as Ref<Locale>,
    changeLang,
  }
}

// generates messages from glob imports
export function i18nCreateMessages(
  files: Record<string, unknown>,
) {
  return Object.fromEntries(
    Object.entries(files).map(([path, messages]) => {
      const locale = path.match(/\/([^/]+)\.json$/)?.[1]

      if (!locale) {
        throw new Error(`Could not determine locale from "${path}"`)
      }

      return [locale, messages]
    }),
  )
}