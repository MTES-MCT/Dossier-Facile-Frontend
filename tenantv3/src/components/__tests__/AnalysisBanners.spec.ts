import { mount } from '@vue/test-utils'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import { useI18nForTest } from 'df-shared-next/src/helper/__tests__/use18n'
import { describe, expect, it } from 'vitest'
import { taxYear } from '../tax/lib/taxYear'
import AnalysisBanners from '../analysis/AnalysisBanners.vue'
import AnalysisBannersSource from '../analysis/AnalysisBanners.vue?raw'

const LOCALE = 'fr'
const { i18n, t } = useI18nForTest(AnalysisBannersSource, LOCALE)

const genericBannerStub = {
  name: 'GenericAnalysisErrorContent',
  props: [
    'title',
    'currentLines',
    'expectedLines',
    'currentDocumentLabel',
    'expectedDocumentLabel',
    'notMatchingLabel',
    'explainLinkLabel'
  ],
  template:
    '<div data-test="generic-banner-stub">{{ title }}|{{ (currentLines || []).join("||") }}|{{ (expectedLines || []).join("||") }}</div>'
}

function mountBanners(failedRules: DocumentRule[]) {
  return mount(AnalysisBanners, {
    props: { failedRules },
    global: {
      plugins: [i18n],
      stubs: {
        VIcon: true,
        GenericAnalysisErrorContent: genericBannerStub
      }
    }
  })
}

function buildExpirationRule(extractedDate: string): DocumentRule {
  return {
    rule: 'R_VISALE_CERTIFICATE_EXPIRATION',
    message: 'Document expiré',
    level: 'ERROR',
    ruleData: {
      type: 'R_EXPIRATION',
      extractedDate
    }
  }
}

function buildTaxLeafRule(): DocumentRule {
  return {
    rule: 'R_TAX_LEAF',
    message: 'Document incomplet',
    level: 'ERROR',
    ruleData: null
  }
}

describe('AnalysisBanners', () => {
  it.each([
    {
      input: '2024-03-15',
      expectedParams: { date: '15/03/2024' }
    },
    {
      input: '2024-13-45',
      expectedParams: { date: '2024-13-45' }
    },
    {
      input: '15/03/2024',
      expectedParams: { date: '15/03/2024' }
    }
  ])('formats expiration date for "$input"', ({ input, expectedParams }) => {
    const wrapper = mountBanners([buildExpirationRule(input)])
    const banner = wrapper.findComponent({ name: 'GenericAnalysisErrorContent' })
    const props = banner.props() as {
      title: string
      currentLines: string[]
      expectedLines: string[]
    }

    expect(props.currentLines).toHaveLength(1)
    expect(props.expectedLines).toHaveLength(1)
    expect(props.currentLines).toEqual([
      t('rules.expiration.current', { date: expectedParams.date })
    ])
    expect(props.expectedLines).toEqual([t('rules.expiration.expected')])
  })

  it('renders R_TAX_LEAF title, current and expected lines', () => {
    const wrapper = mountBanners([buildTaxLeafRule()])
    const banner = wrapper.findComponent({ name: 'GenericAnalysisErrorContent' })
    const props = banner.props() as {
      title: string
      currentLines: string[]
      expectedLines: string[]
    }

    expect(props.currentLines).toHaveLength(1)
    expect(props.expectedLines).toHaveLength(1)
    expect(props.title).toEqual(t('rules.wrong-number-of-documents.title'))
    expect(props.currentLines).toEqual([t('rules.wrong-number-of-documents.current')])
    expect(props.expectedLines).toEqual([
      t('rules.wrong-number-of-documents.expected', { year: taxYear })
    ])
  })
})
