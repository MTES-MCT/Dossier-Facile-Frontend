import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PropertyTaxAnalysisErrorBannerContent from '../residency/lib/PropertyTaxAnalysisErrorBannerContent.vue'
import BannerSource from '../residency/lib/PropertyTaxAnalysisErrorBannerContent.vue?raw'
import { useI18nForTest } from 'df-shared-next/src/helper/__tests__/useI18n'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import frMessages from '@/locales/fr.json'

const LOCALE = 'fr'
const { i18n, t } = useI18nForTest(BannerSource, LOCALE)
// The link title uses the app-wide "new-window" message, which is not in the component block
i18n.global.mergeLocaleMessage(LOCALE, { 'new-window': frMessages['new-window'] })

function createWrapper() {
  return mount(PropertyTaxAnalysisErrorBannerContent, {
    props: {
      rule: { rule: 'R_PROPERTY_TAX_LEAF' } as DocumentRule,
      notMatchingLabel: 'Documents do not match.',
      explainLinkLabel: 'Explain why.'
    },
    global: {
      plugins: [i18n],
      // tests/unit.setup.ts mocks t to return the key: use the real messages instead
      mocks: { t: (key: string, params?: Record<string, unknown>) => t(key, params) },
      stubs: { VIcon: true, BannerIconTextLine: true }
    }
  })
}

describe('PropertyTaxAnalysisErrorBannerContent', () => {
  it('opens the contact link in a new tab and says so', () => {
    const contactLink = createWrapper().find('a[href="/contact"]')

    expect(contactLink.text()).toBe(t('contact-us.button'))
    expect(contactLink.attributes('target')).toBe('_blank')
    expect(contactLink.attributes('title')).toBe(
      `${t('contact-us.button')} - ${frMessages['new-window']}`
    )
  })
})
