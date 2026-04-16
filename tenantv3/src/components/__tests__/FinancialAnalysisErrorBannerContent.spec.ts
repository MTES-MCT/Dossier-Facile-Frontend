import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import FinancialAnalysisErrorBannerContent from '../financial/lib/analysisBanner/FinancialAnalysisErrorBannerContent.vue'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'

function interpolate(template: string, params?: Record<string, unknown>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(params?.[key] ?? ''))
}

vi.mock('vue-i18n', () => ({
  useI18n: () => {
    const messages: Record<string, string> = {
      'bad-classification.title': 'Type de document incorrect',
      'bad-classification.sub-title-one': 'Documents a ajouter',
      'bad-classification.sub-title-two': 'Documents a remplacer',
      'payslip-name-match.title': 'Identite differente sur les bulletins',
      'payslip-name-match.sub-title-one': 'Identite attendue',
      'payslip-name-match.sub-title-two':
        'Aucun document actuel | Document actuel | Documents actuels',
      'payslip-name-match.error-line-with-name':
        '{fileName} : ce document est au nom de {extractedName}',
      'payslip-name-match.error-line-missing-name':
        "{fileName} : ce document n'a pas le nom attendu",
      'payslip-continuity.title': 'Bulletins de salaire incorrects',
      'payslip-continuity.sub-title-one': 'Documents attendus',
      'payslip-continuity.sub-title-missing': 'Documents manquants',
      'payslip-continuity.sub-title-two':
        'Aucun document actuel | Document actuel | Documents actuels',
      'payslip-continuity.error-line-with-month': '{fileName} : ce document est {monthWithPrep}',
      'payslip-continuity.error-line-not-payslip':
        "{fileName} : ce document n'est pas un bulletin de salaire"
    }

    return {
      locale: ref('fr'),
      t: (key: string, params?: Record<string, unknown>, count?: number) => {
        const raw = messages[key] ?? key
        if (raw.includes('|') && typeof count === 'number') {
          const forms = raw.split('|').map((s) => s.trim())
          const selected =
            forms.length === 3
              ? count === 0
                ? forms[0]
                : count === 1
                  ? forms[1]
                  : forms[2]
              : count > 1
                ? forms[1]
                : forms[0]
          return interpolate(selected, params)
        }
        return interpolate(raw, params)
      }
    }
  }
}))

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
    global: { stubs: globalStubs }
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

    expect(wrapper.text()).toContain('Type de document incorrect')
    expect(wrapper.text()).toContain('Documents a ajouter')
    expect(wrapper.text()).toContain('Documents a remplacer')
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

    expect(wrapper.text()).toContain('Identite differente sur les bulletins')
    expect(wrapper.text()).toContain('Identite attendue')
    expect(wrapper.text()).toContain('Documents actuels')
    expect(wrapper.text()).toContain('identity:Angela C. L. Dubois')
    expect(wrapper.text()).toContain(
      'salaire_octobre.pdf : ce document est au nom de Angela C. L. Dubois'
    )
    expect(wrapper.text()).toContain("R4298RRRR.pdf : ce document n'a pas le nom attendu")

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

    expect(wrapper.text()).toContain('Bulletins de salaire incorrects')
    expect(wrapper.text()).toContain('Documents attendus')
    expect(wrapper.text()).toContain('Documents manquants')
    expect(wrapper.text()).toContain('Documents actuels')

    expect(wrapper.find('[data-test="month-description"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="missing-month-description"]').exists()).toBe(true)

    expect(wrapper.text()).toContain('decembre.pdf : ce document est de décembre 2025')
    expect(wrapper.text()).toContain("octobre.pdf : ce document est d'octobre 2025")
    expect(wrapper.text()).toContain(
      "not-a-payslip.pdf : ce document n'est pas un bulletin de salaire"
    )
  })
})
