import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import FinancialAnalysisErrorBannerContent from '../financial/lib/analysisBanner/FinancialAnalysisErrorBannerContent.vue'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'

const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'fr',
  messages: { fr: {} }
})

const globalStubs = {
  VIcon: true,
  MonthDescription: {
    props: ['expectedMonthList'],
    template:
      '<div data-test="month-description">month:{{ (expectedMonthList || []).join(",") }}</div>'
  },
  IdentityDescription: {
    props: ['expectedName'],
    template:
      '<div data-test="identity-description">identity:{{ expectedName?.firstNames }} {{ expectedName?.lastName }}</div>'
  },
  MissingMonthDescription: {
    props: ['missingMonthList'],
    template:
      '<div data-test="missing-month-description">missing:{{ (missingMonthList || []).join(",") }}</div>'
  }
}

function mountComponent(rule: DocumentRule) {
  return mount(FinancialAnalysisErrorBannerContent, {
    props: { rule, index: 0 },
    global: {
      stubs: globalStubs,
      plugins: [i18n]
    }
  })
}

describe('FinancialAnalysisErrorBannerContent', () => {
  it('renders the payslip classification case', () => {
    const rule: DocumentRule = {
      rule: 'R_DOCUMENT_IA_CLASSIFICATION',
      message: 'msg',
      level: 'ERROR',
      ruleData: {
        type: 'R_PAYSLIP_CLASSIFICATION',
        expectedMonthList: ['2026-04', '2026-03'],
        entriesInError: [
          { fileId: 1, fileName: 'file-a.pdf' },
          { fileId: 2, fileName: 'file-b.pdf' }
        ]
      }
    }

    const wrapper = mountComponent(rule)

    expect(wrapper.find('.title-text').text().trim().length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('file-a.pdf')
    expect(wrapper.text()).toContain('file-b.pdf')

    expect(wrapper.find('[data-test="month-description"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="identity-description"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="missing-month-description"]').exists()).toBe(false)
  })

  it('renders the payslip name match case', () => {
    const rule: DocumentRule = {
      rule: 'R_PAYSLIP_NAME_MATCH',
      message: 'msg',
      level: 'ERROR',
      ruleData: {
        type: 'R_PAYSLIP_NAMES',
        expectedName: {
          firstNames: 'Angela C. L.',
          lastName: 'Dubois',
          preferredName: null
        },
        payslipEntriesInError: [
          {
            fileId: 11,
            fileName: 'salaire_octobre.pdf',
            extractedName: 'Angela C. L. Dubois'
          },
          {
            fileId: 12,
            fileName: 'R4298RRRR.pdf',
            extractedName: ''
          }
        ]
      }
    }

    const wrapper = mountComponent(rule)

    expect(wrapper.find('.title-text').text().trim().length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('identity:Angela C. L. Dubois')
    expect(wrapper.text()).toContain('salaire_octobre.pdf')
    expect(wrapper.text()).toContain('Angela C. L. Dubois')
    expect(wrapper.text()).toContain('R4298RRRR.pdf')

    expect(wrapper.find('[data-test="month-description"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="identity-description"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="missing-month-description"]').exists()).toBe(false)
  })

  it('renders the payslip continuity case', () => {
    const rule: DocumentRule = {
      rule: 'R_PAYSLIP_CONTINUITY',
      message: 'msg',
      level: 'ERROR',
      ruleData: {
        type: 'R_PAYSLIP_CONTINUITY',
        expectedMonthList: ['2026-04', '2026-03', '2026-02'],
        missingMonthList: ['2026-03'],
        payslipEntriesInError: [
          { fileId: 21, fileName: 'decembre.pdf', extractedMonth: '2025-12' },
          { fileId: 22, fileName: 'octobre.pdf', extractedMonth: '2025-10' },
          { fileId: 23, fileName: 'not-a-payslip.pdf', extractedMonth: '' }
        ]
      }
    }

    const wrapper = mountComponent(rule)

    expect(wrapper.find('.title-text').text().trim().length).toBeGreaterThan(0)

    expect(wrapper.find('[data-test="month-description"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="missing-month-description"]').exists()).toBe(true)

    expect(wrapper.text()).toContain('decembre.pdf')
    expect(wrapper.text()).toContain('décembre 2025')
    expect(wrapper.text()).toContain('octobre.pdf')
    expect(wrapper.text()).toContain("d'octobre 2025")
    expect(wrapper.text()).toContain('not-a-payslip.pdf')
  })
})
