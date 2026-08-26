import { AnalyticsService } from '@/services/AnalyticsService'
import dayjs from 'dayjs'
import type { DocumentRule, Name } from 'df-shared-next/src/models/DocumentRule'
import {
  BaseAnalysisErrorStrategy,
  type AnalysisErrorAction,
  type TranslationFunction
} from './BaseAnalysisErrorStrategy'

export class VisaleAnalysisErrorStrategy extends BaseAnalysisErrorStrategy {
  override subCategory = 'visale'

  private formatExtractedName(name: Name): string {
    const last = name.lastName || ''
    const first = name.firstNames || ''
    return `${last} ${first}`.trim()
  }

  private formatExpectedName(name: Name): string {
    const first = name.firstNames || ''
    const last = name.lastName || ''
    return `${first} ${last}`.trim()
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return ''
    const d = dayjs(dateStr)
    return d.isValid() ? d.format('DD/MM/YYYY') : dateStr
  }

  override getHeaderTitle(failedRules: DocumentRule[], t: TranslationFunction): string {
    if (failedRules.length > 1) {
      return t('visale-errors.multiple-header')
    }
    const rule = failedRules[0]
    switch (rule.rule) {
      case 'R_DOCUMENT_IA_CLASSIFICATION':
        return t('visale-errors.bad-classification-header')
      case 'R_VISALE_CERTIFICATE_EXPIRATION': {
        const ruleData = rule.ruleData?.type === 'R_EXPIRATION' ? rule.ruleData : null
        const date = ruleData?.extractedDate ? this.formatDate(ruleData.extractedDate) : ''
        return t('visale-errors.expiration-header', { date })
      }
      case 'R_VISALE_CERTIFICATE_NAME_MATCH': {
        return t('visale-errors.name-header')
      }
      default:
        return rule.message || t('visale-errors.default-header')
    }
  }

  override getBulletText(rule: DocumentRule, t: TranslationFunction): string {
    switch (rule.rule) {
      case 'R_VISALE_CERTIFICATE_EXPIRATION': {
        const ruleData = rule.ruleData?.type === 'R_EXPIRATION' ? rule.ruleData : null
        const date = ruleData?.extractedDate ? this.formatDate(ruleData.extractedDate) : ''
        return t('visale-errors.expiration-bullet', { date })
      }
      case 'R_VISALE_CERTIFICATE_NAME_MATCH': {
        const ruleData = rule.ruleData?.type === 'R_NAMES' ? rule.ruleData : null
        const extracted = ruleData?.extractedNames?.[0]
        const nameStr = extracted ? this.formatExtractedName(extracted) : ''
        return t('visale-errors.name-bullet', { name: nameStr })
      }
      case 'R_DOCUMENT_IA_CLASSIFICATION':
        return t('visale-errors.bad-classification-bullet')
      default:
        return rule.message
    }
  }

  override getBulletList(failedRules: DocumentRule[], t: TranslationFunction): string[] {
    const bullets: string[] = []

    if (failedRules.length > 1) {
      for (const rule of failedRules) {
        if (rule.rule === 'R_VISALE_CERTIFICATE_NAME_MATCH') {
          bullets.push(...this.getNameBullets(rule, t))
        } else {
          bullets.push(this.getBulletText(rule, t))
        }
      }
      return bullets
    }

    if (failedRules.length === 1 && failedRules[0].rule === 'R_VISALE_CERTIFICATE_NAME_MATCH') {
      return this.getNameBullets(failedRules[0], t)
    }

    return []
  }

  private getNameBullets(rule: DocumentRule, t: TranslationFunction): string[] {
    const ruleData = rule.ruleData?.type === 'R_NAMES' ? rule.ruleData : null
    const extractedNames = ruleData?.extractedNames ?? []

    if (extractedNames.length > 0) {
      return extractedNames.map((extracted) => {
        const nameStr = this.formatExtractedName(extracted)
        return t('visale-errors.name-bullet', { name: nameStr })
      })
    }

    return [this.getBulletText(rule, t)]
  }

  override onLinkClick(_href: string): void {
    AnalyticsService.document_analysis_visale_help()
  }

  override getExpectedDocumentHtml(failedRules: DocumentRule[], t: TranslationFunction): string {
    const hasClassification = failedRules.some((r) => r.rule === 'R_DOCUMENT_IA_CLASSIFICATION')
    const hasNameMatch = failedRules.some((r) => r.rule === 'R_VISALE_CERTIFICATE_NAME_MATCH')
    const hasExpiration = failedRules.some((r) => r.rule === 'R_VISALE_CERTIFICATE_EXPIRATION')

    if (hasClassification) {
      return t('visale-errors.expected-classification')
    }

    const nameRule = failedRules.find((r) => r.rule === 'R_VISALE_CERTIFICATE_NAME_MATCH')
    const nameRuleData = nameRule?.ruleData?.type === 'R_NAMES' ? nameRule.ruleData : null
    const expectedNameObj = nameRuleData?.expectedName
    const nameStr = expectedNameObj ? this.formatExpectedName(expectedNameObj) : ''

    if (hasNameMatch && hasExpiration) {
      return t('visale-errors.expected-name-and-expiration', { name: nameStr })
    }
    if (hasNameMatch) {
      return t('visale-errors.expected-name', { name: nameStr })
    }
    if (hasExpiration) {
      return t('visale-errors.expected-expiration')
    }

    return t('visale-errors.expected-default')
  }

  override getAction(failedRules: DocumentRule[], t: TranslationFunction): AnalysisErrorAction | undefined {
    let customEventName = 'errorGuarantor'
    if (failedRules.length === 1) {
      switch (failedRules[0].rule) {
        case 'R_VISALE_CERTIFICATE_EXPIRATION':
          customEventName = 'errorGuarantorExpiration'
          break
        case 'R_DOCUMENT_IA_CLASSIFICATION':
          customEventName = 'errorGuarantorClassification'
          break
        case 'R_VISALE_CERTIFICATE_NAME_MATCH':
          customEventName = 'errorGuarantorName'
          break
      }
    } else if (failedRules.length > 1) {
      customEventName = 'multipleError'
    }

    return {
      title: t('visale-errors.action-title'),
      description: t('visale-errors.action-description'),
      buttonLabel: t('visale-errors.action-button'),
      subtext: t('visale-errors.action-subtext'),
      customEventName
    }
  }
}
