import { getTaxYearPeriod, type TaxYearPeriod } from '@/components/tax/lib/taxYear'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import { BaseAnalysisErrorStrategy, type TranslationFunction } from './BaseAnalysisErrorStrategy'

export function getTaxAnalysisErrorKind(rule: DocumentRule) {
  switch (rule.rule) {
    case 'R_TAX_BAD_CLASSIFICATION_DECLARATIVE':
      return 'declarative'
    case 'R_TAX_BAD_CLASSIFICATION':
    case 'R_DOCUMENT_IA_CLASSIFICATION':
      return rule.ruleData?.type === 'R_TAX_CLASSIFICATION' && rule.ruleData.isDeclarativeSituation
        ? 'declarative'
        : 'classification'
    case 'R_TAX_FAKE':
      return 'unreadable'
    case 'R_TAX_LEAF':
      return 'pages'
    case 'R_TAX_N1':
    case 'R_TAX_N3':
    case 'R_TAX_WRONG_YEAR':
      return 'year'
    case 'R_TAX_NAMES':
      return 'names'
    default:
      return 'unknown'
  }
}

// These values come from documents: preserve them as text inside the translated HTML.
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }
    return entities[character]
  })
}

export class TaxAnalysisErrorStrategy extends BaseAnalysisErrorStrategy {
  constructor(
    private readonly options: {
      period?: TaxYearPeriod
      pageCount?: number
      isSelf?: boolean
    } = {}
  ) {
    super()
    this.subCategory = 'MY_NAME'
  }

  private getExtractedNames(rule: DocumentRule): string[] {
    const data = rule.ruleData
    if (data?.type === 'R_TAX_NAMES') return data.extractedIdentities.filter(Boolean)
    if (data?.type === 'R_NAMES')
      return data.extractedNames.map((name) => this.formatExtractedName(name))
    return []
  }

  getHeaderTitle(failedRules: DocumentRule[], t: TranslationFunction): string {
    if (failedRules.length !== 1) return t('tax-errors.multiple-title')
    const rule = failedRules[0]
    const kind = getTaxAnalysisErrorKind(rule)
    if (kind === 'names') {
      const names = this.getExtractedNames(rule)
      return names.length === 1
        ? t(`tax-errors.names-title-${this.options.isSelf === false ? 'other' : 'tenant'}`, {
            name: names[0]
          })
        : t('tax-errors.names-title')
    }
    if (kind === 'year') {
      const data = rule.ruleData
      const isOlder =
        data?.type === 'R_TAX_YEARS' &&
        data.extractedYears.length > 0 &&
        data.extractedYears.every((year) => year < data.expectedYear)
      return t(
        isOlder || rule.rule === 'R_TAX_N3' ? 'tax-errors.old-year-title' : 'tax-errors.year-title'
      )
    }
    return t(`tax-errors.${kind}-title`)
  }

  getBulletText(rule: DocumentRule, t: TranslationFunction): string {
    if (rule.rule === 'R_TAX_N1') return t('tax-errors.missing-year-bullet')
    if (rule.rule === 'R_TAX_N3') return t('tax-errors.old-year-bullet')
    const kind = getTaxAnalysisErrorKind(rule)
    return t(
      `tax-errors.${kind === 'pages' && this.options.pageCount === 1 ? 'single-page' : kind}-bullet`
    )
  }

  getBulletList(failedRules: DocumentRule[], t: TranslationFunction): string[] {
    return failedRules.flatMap((rule) => {
      if (getTaxAnalysisErrorKind(rule) === 'names') {
        const names = this.getExtractedNames(rule)
        if (names.length) {
          return names.map((name) => t('tax-errors.named-bullet', { name: escapeHtml(name) }))
        }
      }
      if (getTaxAnalysisErrorKind(rule) === 'year' && rule.ruleData?.type === 'R_TAX_YEARS') {
        const years = rule.ruleData.extractedYears.filter(Number.isInteger)
        if (years.length) {
          return years.map((incomeYear) =>
            t('tax-errors.year-with-value-bullet', {
              taxYear: incomeYear + 1,
              incomeYear
            })
          )
        }
      }
      return [this.getBulletText(rule, t)]
    })
  }

  getExpectedDocumentHtml(failedRules: DocumentRule[], t: TranslationFunction): string {
    const period = this.options.period ?? getTaxYearPeriod()
    const yearData = failedRules.find((rule) => rule.rule === 'R_TAX_WRONG_YEAR')?.ruleData
    // A report saved before the 15 September cutoff still carries the previous expected year:
    // never ask for a notice older than the one the current calendar requires.
    const incomeYear =
      yearData?.type === 'R_TAX_YEARS' && Number.isInteger(yearData.expectedYear)
        ? Math.max(yearData.expectedYear, period.incomeYear)
        : period.incomeYear
    const years =
      period.period === 'JULY_TO_SEPTEMBER' && incomeYear === period.incomeYear
        ? [incomeYear, period.nextIncomeYear]
        : [incomeYear]
    let label = years
      .map((year) =>
        t('tax-errors.notice-label', {
          taxYear: year + 1,
          incomeYear: year
        })
      )
      .join(t('tax-errors.or'))
    if (failedRules.some((rule) => getTaxAnalysisErrorKind(rule) === 'pages')) {
      label = t('tax-errors.with-pages', { document: label })
    }
    const nameData = failedRules.find((rule) => rule.rule === 'R_TAX_NAMES')?.ruleData
    const expectedName =
      nameData?.type === 'R_TAX_NAMES' || nameData?.type === 'R_NAMES'
        ? this.formatExpectedName(nameData.expectedName)
        : ''
    return t('tax-errors.expected', {
      document: label,
      name: expectedName ? t('tax-errors.expected-name', { name: escapeHtml(expectedName) }) : ''
    })
  }
}
