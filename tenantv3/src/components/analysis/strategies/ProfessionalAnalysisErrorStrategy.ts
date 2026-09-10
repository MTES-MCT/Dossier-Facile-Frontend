import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'
import type { MainActivityCategory } from '@/components/documents/share/DocumentTypeConstants'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import { AnalyticsService } from '@/services/AnalyticsService'
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

export const PNDS_URL = `${import.meta.env.VITE_PNDS_BASE_URL}/api/public/redirect/activite_professionnelle`

export class ProfessionalAnalysisErrorStrategy extends BaseAnalysisErrorStrategy {
  override subCategory: string

  constructor(subCategory = 'professional') {
    super()
    this.subCategory = subCategory
  }

  protected override formatDate(dateStr: string): string {
    if (!dateStr) return ''
    const d = dayjs(dateStr)
    return d.isValid() ? d.format('D MMMM YYYY') : dateStr
  }

  override getHeaderTitle(failedRules: DocumentRule[], t: TranslationFunction): string {
    if (failedRules.length > 1) {
      return t('professional-errors.multiple-header')
    }
    const rule = failedRules[0]
    switch (rule.rule) {
      case 'R_PROFESSIONAL_2DDOC_ISSUE_DATE': {
        return t('professional-errors.issue-date-header')
      }
      case 'R_PROFESSIONAL_NAME_MATCH': {
        const ruleData = rule.ruleData?.type === 'R_NAMES' ? rule.ruleData : null
        const extractedNames = ruleData?.extractedNames ?? []
        if (extractedNames.length === 1) {
          const nameStr = this.formatExtractedName(extractedNames[0])
          if (nameStr) {
            return t('professional-errors.name-header', { name: nameStr })
          }
        }
        return t('professional-errors.default-name-header')
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
    const bullets: string[] = []
    for (const rule of failedRules) {
      if (rule.rule === 'R_PROFESSIONAL_NAME_MATCH') {
        bullets.push(...this.getNameBullets(rule, t, 'professional-errors.name-bullet'))
      } else {
        bullets.push(this.getBulletText(rule, t))
      }
    }
    return bullets
  }

  override getExpectedDocumentHtml(failedRules: DocumentRule[], t: TranslationFunction): string {
    const hasNameMatch = failedRules.some((r) => r.rule === 'R_PROFESSIONAL_NAME_MATCH')
    const hasIssueDate = failedRules.some((r) => r.rule === 'R_PROFESSIONAL_2DDOC_ISSUE_DATE')
    const nameStr = this.getFormattedExpectedName(failedRules, 'R_PROFESSIONAL_NAME_MATCH')
    const minDate = dayjs().subtract(1, 'month').format('D MMMM YYYY')

    if (hasNameMatch && hasIssueDate) {
      return t('professional-errors.expected-name-and-issue-date', {
        name: nameStr,
        minDate,
        url: PNDS_URL
      })
    }
    if (hasNameMatch) {
      return t('professional-errors.expected-name', {
        name: nameStr,
        url: PNDS_URL
      })
    }
    if (hasIssueDate) {
      return t('professional-errors.expected-issue-date', {
        minDate,
        url: PNDS_URL
      })
    }

    return t('professional-errors.expected-default', {
      url: PNDS_URL
    })
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  override onLinkClick(_href: string): void {
    AnalyticsService.openAttestationMesDroitsSociaux()
  }
}
