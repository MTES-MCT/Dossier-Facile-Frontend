import type { MainActivityCategory } from '@/components/documents/share/DocumentTypeConstants'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import {
  BaseAnalysisErrorStrategy,
  type TranslationFunction
} from './BaseAnalysisErrorStrategy'

export const IA_SUPPORTED_PROFESSIONAL_CATEGORIES: MainActivityCategory[] = [
  'CDI',
  'CDD',
  'ALTERNATION',
  'INTERNSHIP',
  'INTERMITTENT'
]

export class ProfessionalAnalysisErrorStrategy extends BaseAnalysisErrorStrategy {
  override subCategory: string

  constructor(subCategory = 'professional') {
    super()
    this.subCategory = subCategory
  }

  override getHeaderTitle(failedRules: DocumentRule[], t: TranslationFunction): string {
    if (failedRules.length > 1) {
      return t('professional-errors.multiple-header')
    }
    const rule = failedRules[0]
    switch (rule.rule) {
      case 'R_PROFESSIONAL_2DDOC_ISSUE_DATE': {
        const ruleData = rule.ruleData?.type === 'R_EXPIRATION' ? rule.ruleData : null
        const date = ruleData?.extractedDate ? this.formatDate(ruleData.extractedDate) : ''
        if (!date) {
          return rule.message || t('professional-errors.default-header')
        }
        return t('professional-errors.issue-date-header', { date })
      }
      case 'R_PROFESSIONAL_NAME_MATCH': {
        return t('professional-errors.name-header')
      }
      default:
        return rule.message || t('professional-errors.default-header')
    }
  }

  override getBulletText(rule: DocumentRule, t: TranslationFunction): string {
    switch (rule.rule) {
      case 'R_PROFESSIONAL_2DDOC_ISSUE_DATE': {
        const ruleData = rule.ruleData?.type === 'R_EXPIRATION' ? rule.ruleData : null
        const date = ruleData?.extractedDate ? this.formatDate(ruleData.extractedDate) : ''
        if (!date) {
          return rule.message || t('professional-errors.default-header')
        }
        return t('professional-errors.issue-date-bullet', { date })
      }
      case 'R_PROFESSIONAL_NAME_MATCH': {
        const ruleData = rule.ruleData?.type === 'R_NAMES' ? rule.ruleData : null
        const extracted = ruleData?.extractedNames?.[0]
        const nameStr = extracted ? this.formatExtractedName(extracted) : ''
        return t('professional-errors.name-bullet', { name: nameStr })
      }
      default:
        return rule.message
    }
  }

  override getBulletList(failedRules: DocumentRule[], t: TranslationFunction): string[] {
    return this.buildBulletList(
      failedRules,
      t,
      'R_PROFESSIONAL_NAME_MATCH',
      'professional-errors.name-bullet'
    )
  }

  override getExpectedDocumentHtml(failedRules: DocumentRule[], t: TranslationFunction): string {
    const hasNameMatch = failedRules.some((r) => r.rule === 'R_PROFESSIONAL_NAME_MATCH')
    const hasIssueDate = failedRules.some((r) => r.rule === 'R_PROFESSIONAL_2DDOC_ISSUE_DATE')
    const nameStr = this.getFormattedExpectedName(failedRules, 'R_PROFESSIONAL_NAME_MATCH')

    if (hasNameMatch && hasIssueDate) {
      return t('professional-errors.expected-name-and-issue-date', { name: nameStr })
    }
    if (hasNameMatch) {
      return t('professional-errors.expected-name', { name: nameStr })
    }
    if (hasIssueDate) {
      return t('professional-errors.expected-issue-date')
    }

    return t('professional-errors.expected-default')
  }
}
