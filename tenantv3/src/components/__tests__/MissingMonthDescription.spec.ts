import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { formatYearMonth } from 'df-shared-next/src/services/UtilsService'
import MissingMonthDescription from '../financial/lib/analysisBanner/MissingMonthDescription.vue'
import MissingMonthDescriptionSource from '../financial/lib/analysisBanner/MissingMonthDescription.vue?raw'

const LOCALE = 'fr'

const inlineI18nMatch = MissingMonthDescriptionSource.match(/<i18n[^>]*>([\s\S]*?)<\/i18n>/)
const inlineI18nMessages = JSON.parse(inlineI18nMatch![1])
const ifAvailable = inlineI18nMessages[LOCALE]['if-available']

const i18n = createI18n({
  legacy: false,
  locale: LOCALE,
  fallbackLocale: LOCALE,
  messages: { [LOCALE]: {} }
})

const globalStubs = {
  BannerIconTextLine: {
    props: ['text'],
    template: '<div data-test="line">{{ text }}</div>'
  }
}

function mountComponent(missingMonthList: string[]) {
  return mount(MissingMonthDescription, {
    props: { missingMonthList },
    global: {
      stubs: globalStubs,
      plugins: [i18n]
    }
  })
}

function formatMonth(value: string) {
  return formatYearMonth(value, LOCALE)
}

afterEach(() => {
  vi.useRealTimers()
})

describe('MissingMonthDescription', () => {
  it('day > 15: adds the "if available" suffix on the current month', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 3, 20, 12, 0, 0)) // 20/04/2026

    const wrapper = mountComponent(['2026-04', '2026-03'])
    const lines = wrapper.findAll('[data-test="line"]').map((w) => w.text())

    expect(lines).toEqual([
      formatMonth('2026-03'),
      `${formatMonth('2026-04')} ${ifAvailable}`
    ])
  })

  it('day <= 15: no suffix, the current month is not in the expected window', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 3, 14, 12, 0, 0)) // 14/04/2026

    const wrapper = mountComponent(['2026-03', '2026-02'])
    const lines = wrapper.findAll('[data-test="line"]').map((w) => w.text())

    expect(lines).toEqual([formatMonth('2026-02'), formatMonth('2026-03')])
    expect(wrapper.text()).not.toContain(ifAvailable)
  })
})
