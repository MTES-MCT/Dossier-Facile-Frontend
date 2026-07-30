import { mount } from '@vue/test-utils'
import { useI18nForTest } from 'df-shared-next/src/helper/__tests__/useI18n'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import { describe, expect, it } from 'vitest'
import TaxAnalysisErrorBannerContent from '../tax/lib/analysisBanner/TaxAnalysisErrorBannerContent.vue'
import TaxBannerSource from '../tax/lib/analysisBanner/TaxAnalysisErrorBannerContent.vue?raw'

const LOCALE = 'fr'
const { i18n, t } = useI18nForTest(TaxBannerSource, LOCALE)

const globalStubs = {
  VIcon: true,
  DsfrButton: {
    props: ['label'],
    template: '<button class="dsfr-button-stub" @click="$emit(\'click\')">{{ label }}</button>'
  },
  BannerIconTextLine: {
    props: ['text'],
    template: '<div data-test="error-line">{{ text }}</div>'
  }
}

function mountComponent(rule: DocumentRule) {
  return mount(TaxAnalysisErrorBannerContent, {
    props: {
      rule,
      index: 0,
      currentDocumentLabel: 'Document actuel',
      expectedDocumentLabel: 'Document à ajouter',
      notMatchingLabel: "Vous n'êtes pas d'accord ?",
      explainLinkLabel: 'Expliquer votre situation'
    },
    global: {
      stubs: globalStubs,
      plugins: [i18n],
      mocks: {
        t: (key: string, params?: Record<string, unknown>) => t(key, params)
      }
    }
  })
}

describe('TaxAnalysisErrorBannerContent', () => {
  it('renders classification error banner with confirm button and handles click', async () => {
    const rule: DocumentRule = {
      rule: 'R_TAX_BAD_CLASSIFICATION',
      message: 'Mauvais document',
      level: 'ERROR',
      ruleData: {
        type: 'R_TAX_CLASSIFICATION',
        isDeclarativeSituation: false
      }
    }

    const wrapper = mountComponent(rule)

    expect(wrapper.text()).toContain(t('bad-classification.title'))
    expect(wrapper.text()).toContain(t('bad-classification.expected'))
    expect(wrapper.text()).toContain(t('confirm-prompt'))

    const button = wrapper.find('.dsfr-button-stub')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe(t('confirm-button'))

    await button.trigger('click')

    expect(wrapper.emitted('explain')).toBeTruthy()
    const explainEmits = wrapper.emitted('explain') as string[][]
    expect(explainEmits[0][0]).toContain("J'ai fourni un avis d'imposition")
  })

  it('renders R_TAX_LEAF banner without confirmation button', () => {
    const rule: DocumentRule = {
      rule: 'R_TAX_LEAF',
      message: 'Document incomplet',
      level: 'ERROR',
      ruleData: null
    }

    const wrapper = mountComponent(rule)

    expect(wrapper.text()).toContain(t('wrong-number-of-documents.title'))
    expect(wrapper.find('.dsfr-button-stub').exists()).toBe(false)
  })
})
