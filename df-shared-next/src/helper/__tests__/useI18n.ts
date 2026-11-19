import { createI18n, type I18nOptions } from 'vue-i18n'

type TestMessages = Record<string, Record<string, unknown>>

export function useI18nForTest(
  componentSource: string,
  locale: string = 'fr'
) {
  const inlineI18nMatch =
    /<i18n(?:\s[^>]*)?>([\s\S]*?)<\/i18n>/.exec(componentSource)

  if (!inlineI18nMatch?.[1]) {
    throw new Error('No <i18n> block found in component source')
  }

  const parsedMessages = JSON.parse(
    inlineI18nMatch[1]
  ) as TestMessages

  const messages = {
    [locale]: parsedMessages[locale] ?? {}
  } as I18nOptions['messages']

  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: locale,
    messages
  })

  const t = (key: string, params?: Record<string, unknown>): string =>
    (i18n.global as unknown as { t: (key: string, params?: Record<string, unknown>) => string }).t(
      key,
      params
    )

  return {
    i18n,
    messages: parsedMessages,
    t
  }
}