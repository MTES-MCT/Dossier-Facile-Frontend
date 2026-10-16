import { createAppI18n, i18nCreateMessages } from 'df-shared-next/src/i18n'

import base from './locales/base.json'
const localeFiles = import.meta.glob(['./locales/*.json', '!./locales/base.json'], {
  eager: true,
  import: 'default',
})

export const { i18n, changeLang, locale } = createAppI18n(i18nCreateMessages(localeFiles, base))