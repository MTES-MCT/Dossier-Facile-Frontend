import { h, ref } from 'vue'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { SafeHtmlPlugin } from 'df-shared-next/src/services/SanitizeService'
import { TaxAnalysisErrorStrategy } from '../../analysis/strategies/TaxAnalysisErrorStrategy'
import TaxAnalysisGuidance from '../lib/TaxAnalysisGuidance.vue'
import { getTaxYearPeriod } from '../lib/taxYear'
import { taxKey } from '../lib/taxState'

export function rule(rule: string, ruleData: DocumentRule['ruleData'] = null): DocumentRule {
  return { rule, ruleData, message: 'Technical backend message', level: 'CRITICAL' }
}
export const classification = rule('R_TAX_BAD_CLASSIFICATION', {
  type: 'R_TAX_CLASSIFICATION',
  isDeclarativeSituation: false
})
export const declarative = rule('R_TAX_BAD_CLASSIFICATION', {
  type: 'R_TAX_CLASSIFICATION',
  isDeclarativeSituation: true
})
export const pages = rule('R_TAX_LEAF')
export const year = rule('R_TAX_WRONG_YEAR', {
  type: 'R_TAX_YEARS',
  expectedYear: 2025,
  extractedYears: [2024]
})
export const names = rule('R_TAX_NAMES', {
  type: 'R_TAX_NAMES',
  expectedName: { firstNames: 'Christophe', lastName: 'Leconte', preferredName: null },
  extractedIdentities: ['RECOBER Laura']
})

export function taxErrorBlockOptions(
  failedRules: DocumentRule[],
  options: ConstructorParameters<typeof TaxAnalysisErrorStrategy>[0] = {},
  locale = 'fr',
  identityTo: string | null = '/nom-locataire'
) {
  return {
    props: {
      failedRules,
      headingLevel: 2 as const,
      strategy: new TaxAnalysisErrorStrategy({
        period: getTaxYearPeriod(new Date(2026, 10, 16)),
        pageCount: 1,
        ...options
      })
    },
    slots: {
      guidance: ({ failedRules }: { failedRules: DocumentRule[] }) =>
        h(TaxAnalysisGuidance, {
          failedRules,
          parentsTo: '/documents-locataire/5/sans-avis/parents',
          identityTo: identityTo ?? undefined,
          isSelf: options.isSelf !== false
        })
    },
    global: {
      provide: {
        [taxKey as symbol]: {
          category: 'tax',
          document: ref(Object.assign(new DfDocument(), { id: 42 }))
        }
      },
      plugins: [
        createI18n({ legacy: false, locale, fallbackLocale: 'fr', warnHtmlMessage: false }),
        SafeHtmlPlugin,
        createRouter({
          history: createMemoryHistory(),
          routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }]
        })
      ]
    }
  }
}
