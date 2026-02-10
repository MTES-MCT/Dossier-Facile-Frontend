export type Name = {
  firstNames: string
  lastName: string
  preferredName: string | null
}

export type FrenchIdentityCardExpirationRuleData = {
  type: 'R_FRENCH_IDENTITY_CARD_EXPIRATION'
  extractedDate: string
}

export type TaxClassificationRuleData = {
  type: 'R_TAX_CLASSIFICATION'
  isDeclarativeSituation: boolean
}

export type NamesRuleData = {
  type: 'R_NAMES'
  expectedName: Name
  extractedNames: Name[]
}

export type TaxYearsRuleData = {
  type: 'R_TAX_YEARS'
  expectedYear: number
  extractedYears: number[]
}

export type PayslipContinuityRuleData = {
  type: 'R_PAYSLIP_CONTINUITY'
  expectedMonthList: string[]
  extractedMonthList: string[]
}

export type RuleData =
  | FrenchIdentityCardExpirationRuleData
  | TaxClassificationRuleData
  | NamesRuleData
  | TaxYearsRuleData
  | PayslipContinuityRuleData

export type DocumentRule = {
  rule: string
  message: string
  level: string
  ruleData: RuleData | null
}
