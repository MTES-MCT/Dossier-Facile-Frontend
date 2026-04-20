import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import MissingMonthDescription from '../financial/lib/analysisBanner/MissingMonthDescription.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'fr',
  messages: { fr: {} }
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

afterEach(() => {
  vi.useRealTimers()
})

describe('MissingMonthDescription', () => {
  it('jour > 15 : affiche « (si disponible) » sur le mois en cours', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 3, 20, 12, 0, 0)) // 20/04/2026

    const wrapper = mountComponent(['2026-04', '2026-03'])
    const lines = wrapper.findAll('[data-test="line"]').map((w) => w.text())

    expect(lines).toEqual(['mars 2026', 'avril 2026 (si disponible)'])
  })

  it('jour <= 15 : aucun suffixe, le mois en cours n’est pas dans la fenêtre attendue', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 3, 14, 12, 0, 0)) // 14/04/2026

    const wrapper = mountComponent(['2026-03', '2026-02'])
    const lines = wrapper.findAll('[data-test="line"]').map((w) => w.text())

    expect(lines).toEqual(['février 2026', 'mars 2026'])
    expect(wrapper.text()).not.toContain('(si disponible)')
  })
})
