import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'

export type TranslationFunction = (key: string, params?: Record<string, any>) => string

export interface AnalysisErrorAction {
  title: string
  description: string
  buttonLabel: string
  subtext?: string
  customEventName: string
}

export abstract class BaseAnalysisErrorStrategy {
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
  getAction(_failedRules: DocumentRule[], _t: TranslationFunction): AnalysisErrorAction | undefined {
    return undefined
  }
}
