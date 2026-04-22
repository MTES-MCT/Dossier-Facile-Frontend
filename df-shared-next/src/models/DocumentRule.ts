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

export type TaxNamesRuleData = {
  type: 'R_TAX_NAMES'
  expectedName: Name
  extractedIdentities: string[]
}

export type TaxYearsRuleData = {
  type: 'R_TAX_YEARS'
  expectedYear: number
  extractedYears: number[]
}

export type PayslipClassificationRuleData = {
  type: 'R_PAYSLIP_CLASSIFICATION'
  entriesInError: PayslipClassificationEntry[]
  expectedMonthList: string[]
}

export type PayslipClassificationEntry = {
  fileId: number
  fileName: string
}

export type PayslipNameMatchRuleData = {
  type: 'R_PAYSLIP_NAMES'
  expectedName: Name
  payslipEntriesInError: PayslipNamesEntry[]
}

export type PayslipNamesEntry = {
  fileId: number
  fileName: string
  extractedName: string
}

export type PayslipContinuityRuleData = {
  type: 'R_PAYSLIP_CONTINUITY'
  expectedMonthList: string[]
  payslipEntriesInError: PayslipContinuityEntry[]
  missingMonthList: string[]
}

export type PayslipContinuityEntry = {
  fileId: number
  fileName: string
  extractedMonth: string
}

export type DocumentExpirationRuleData = {
  type: 'R_EXPIRATION'
  extractedDate: string
}

export type RuleData =
  | FrenchIdentityCardExpirationRuleData
  | TaxClassificationRuleData
  | NamesRuleData
  | TaxYearsRuleData
  | TaxNamesRuleData
  | PayslipContinuityRuleData
  | PayslipNameMatchRuleData
  | PayslipClassificationRuleData
  | DocumentExpirationRuleData

export type DocumentRule = {
  rule: string
  message: string
  level: string
  ruleData: RuleData | null
}
