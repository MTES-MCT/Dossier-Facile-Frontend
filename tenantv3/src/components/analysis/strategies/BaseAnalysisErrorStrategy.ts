import dayjs from 'dayjs'
import type { DocumentRule, Name } from 'df-shared-next/src/models/DocumentRule'

export type TranslationFunction = (key: string, params?: Record<string, unknown>) => string

export interface AnalysisErrorAction {
  title: string
  description: string
  buttonLabel: string
  subtext?: string
  customEventName: string
}

export abstract class BaseAnalysisErrorStrategy {
  subCategory?: string

  protected formatExtractedName(name: Name): string {
    const last = name.lastName || ''
    const first = name.firstNames || ''
    return `${last} ${first}`.trim()
  }

  protected formatExpectedName(name: Name): string {
    const first = name.firstNames || ''
    const last = name.lastName || ''
    return `${first} ${last}`.trim()
  }

  protected formatDate(dateStr: string): string {
    if (!dateStr) return ''
    const d = dayjs(dateStr)
    return d.isValid() ? d.format('DD/MM/YYYY') : dateStr
  }

  /**
   * Title of the header block (handles single vs multiple errors).
   */
  abstract getHeaderTitle(failedRules: DocumentRule[], t: TranslationFunction): string

  /**
   * Bullet item text when multiple errors are present.
   */
  abstract getBulletText(rule: DocumentRule, t: TranslationFunction): string

  /**
   * HTML/text describing the expected document requirement(s).
   */
  abstract getExpectedDocumentHtml(failedRules: DocumentRule[], t: TranslationFunction): string

  /**
   * Optional callback when a link inside the expected document text is clicked.
   */
  onLinkClick?(_href: string): void

  /**
   * Generates bullet items for a name match rule by splitting multiple extracted names into distinct bullets.
   */
  protected getNameBullets(
    rule: DocumentRule,
    t: TranslationFunction,
    bulletKey: string
  ): string[] {
    const ruleData = rule.ruleData?.type === 'R_NAMES' ? rule.ruleData : null
    const extractedNames = ruleData?.extractedNames ?? []

    if (extractedNames.length > 0) {
      return extractedNames.map((extracted) => {
        const nameStr = this.formatExtractedName(extracted)
        return t(bulletKey, { name: nameStr })
      })
    }

    return [this.getBulletText(rule, t)]
  }

  /**
   * Helper to build a bullet list when name match rule can expand to multiple bullets.
   */
  protected buildBulletList(
    failedRules: DocumentRule[],
    t: TranslationFunction,
    nameMatchRule: string,
    nameBulletKey: string
  ): string[] {
    if (failedRules.length > 1) {
      const bullets: string[] = []
      for (const rule of failedRules) {
        if (rule.rule === nameMatchRule) {
          bullets.push(...this.getNameBullets(rule, t, nameBulletKey))
        } else {
          bullets.push(this.getBulletText(rule, t))
        }
      }
      return bullets
    }

    if (failedRules.length === 1 && failedRules[0].rule === nameMatchRule) {
      return this.getNameBullets(failedRules[0], t, nameBulletKey)
    }

    return []
  }

  /**
   * Extracts and formats the expected name from the first name match rule in the list.
   */
  protected getFormattedExpectedName(failedRules: DocumentRule[], nameMatchRule: string): string {
    const nameRule = failedRules.find((r) => r.rule === nameMatchRule)
    const nameRuleData = nameRule?.ruleData?.type === 'R_NAMES' ? nameRule.ruleData : null
    const expectedNameObj = nameRuleData?.expectedName
    return expectedNameObj ? this.formatExpectedName(expectedNameObj) : ''
  }

  /**
   * List of bullet item texts/HTML to display.
   */
  getBulletList(failedRules: DocumentRule[], t: TranslationFunction): string[] {
    if (failedRules.length > 1) {
      return failedRules.map((rule) => this.getBulletText(rule, t))
    }
    return []
  }

  /**
   * Optional step action (e.g. continue without guarantor).
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  getAction(_failedRules: DocumentRule[], _t: TranslationFunction): AnalysisErrorAction | undefined {
    return undefined
  }
}
