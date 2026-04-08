import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import AnalysisBanners from '../analysis/AnalysisBanners.vue'
import type { DocumentRule, Name } from 'df-shared-next/src/models/DocumentRule'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: ref('fr'),
    t: (key: string, params?: Record<string, string>) => {
      if (key === 'rules.expiration.current') {
        return `Document avec date d'expiration ${params?.date ?? ''}`
      }
      if (key === 'rules.payslip-continuity.current-month') {
        return `Bulletin pour ${params?.month ?? ''}`
      }
      if (key === 'rules.payslip-continuity.expected-lead') {
        return 'Trois mois consécutifs :'
      }
      if (key === 'rules.payslip-continuity.expected-month') {
        return params?.month ?? ''
      }
      if (key === 'rules.names.payslip.current') {
        return `Bulletin au nom de ${params?.name ?? ''}`
      }
      if (key === 'rules.names.payslip.expected') {
        return `Attendu au nom de ${params?.name ?? ''}`
      }
      return key
    }
  })
}))

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

function buildPayslipContinuityRule(): DocumentRule {
  return {
    rule: 'R_PAYSLIP_CONTINUITY',
    message: 'continuity',
    level: 'ERROR',
    ruleData: {
      type: 'R_PAYSLIP_CONTINUITY',
      expectedMonthList: ['2024-01', '2024-02'],
      extractedMonthList: ['2024-03']
    }
  }
}

function buildPayslipNameRule(): DocumentRule {
  const expectedName: Name = {
    lastName: 'Dupont',
    firstNames: 'Jean',
    preferredName: null
  }
  return {
    rule: 'R_PAYSLIP_NAME_MATCH',
    message: 'name',
    level: 'ERROR',
    ruleData: {
      type: 'R_PAYSLIP_NAMES',
      expectedName,
      extractedIdentities: ['Martin Paul']
    }
  }
}

describe('AnalysisBanners', () => {
  it('renders payslip continuity months', () => {
    const wrapper = mount(AnalysisBanners, {
      props: { failedRules: [buildPayslipContinuityRule()] },
      global: { stubs: { VIcon: true } }
    })
    expect(wrapper.text()).toContain('Bulletin pour')
    expect(wrapper.text()).toContain('Trois mois consécutifs')
  })

  it('renders payslip name rule with payslip namespace', () => {
    const wrapper = mount(AnalysisBanners, {
      props: { failedRules: [buildPayslipNameRule()] },
      global: { stubs: { VIcon: true } }
    })
    expect(wrapper.text()).toContain('Bulletin au nom de Martin Paul')
    expect(wrapper.text()).toContain('Attendu au nom de Dupont Jean')
  })

  it('formats payslip months', () => {
    const rule: DocumentRule = {
      rule: 'R_PAYSLIP_CONTINUITY',
      message: 'continuity',
      level: 'ERROR',
      ruleData: {
        type: 'R_PAYSLIP_CONTINUITY',
        expectedMonthList: ['2024-02'],
        extractedMonthList: ['2024-01']
      }
    }
    const wrapper = mount(AnalysisBanners, {
      props: { failedRules: [rule] },
      global: { stubs: { VIcon: true } }
    })
    // Exercises formatYearMonth + dayjs/locale/fr import
    expect(wrapper.text()).toContain('janvier 2024')
    expect(wrapper.text()).toContain('février 2024')
  })

  it.each([
    { input: '2024-03-15', expected: "Document avec date d'expiration 15/03/2024" },
    { input: '2024-13-45', expected: "Document avec date d'expiration 2024-13-45" },
    { input: '15/03/2024', expected: "Document avec date d'expiration 15/03/2024" }
  ])('formats expiration date for "$input"', ({ input, expected }) => {
    const wrapper = mount(AnalysisBanners, {
      props: {
        failedRules: [buildExpirationRule(input)]
      },
      global: {
        stubs: {
          VIcon: true
        }
      }
    })

    expect(wrapper.text()).toContain(expected)
  })
})
