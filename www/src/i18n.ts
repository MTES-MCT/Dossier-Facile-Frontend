import { createAppI18n, i18nCreateMessages } from 'df-shared-next/src/i18n'

const localeFiles = import.meta.glob('./locales/*.json', {
  eager: true,
  import: 'default',
})

export const { i18n, changeLang, locale } = createAppI18n(i18nCreateMessages(localeFiles))