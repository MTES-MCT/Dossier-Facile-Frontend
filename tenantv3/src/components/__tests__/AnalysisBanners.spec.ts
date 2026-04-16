import { mount } from '@vue/test-utils'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import AnalysisBanners from '../analysis/AnalysisBanners.vue'
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: ref('fr'),
    t: (key: string, params?: Record<string, string>) => {
      if (key === 'rules.expiration.current') {
        return `Document avec date d'expiration ${params?.date ?? ''}`
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

describe('AnalysisBanners', () => {
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
