import { DfFile } from './DfFile'
import { DocumentAnalysisReport } from './DocumentAnalysisReport'
import { DocumentDeniedReasons } from './DocumentDeniedReasons'

export type DocumentStatus = 'TO_PROCESS' | 'VALIDATED' | 'DECLINED'

export type DocumentCategory =
  | 'IDENTIFICATION'
  | 'RESIDENCY'
  | 'PROFESSIONAL'
  | 'FINANCIAL'
  | 'TAX'
  | 'IDENTIFICATION_LEGAL_PERSON'
  | 'GUARANTEE_PROVIDER_CERTIFICATE'
  | 'NULL'

export type ResidencyStep = 'TENANT_RECEIPT' | 'TENANT_PROOF' | 'GUEST_PROOF' | 'GUEST_NO_PROOF'
export type FinancialStep =
  | 'SALARY_EMPLOYED_LESS_3_MONTHS'
  | 'SALARY_EMPLOYED_MORE_3_MONTHS'
  | 'SALARY_EMPLOYED_NOT_YET'
  | 'SALARY_FREELANCE_AUTOENTREPRENEUR'
  | 'SALARY_FREELANCE_OTHER'
  | 'SALARY_INTERMITTENT'
  | 'SALARY_ARTIST_AUTHOR'
  | 'SALARY_UNKNOWN'
  | 'SOCIAL_SERVICE_CAF_LESS_3_MONTHS'
  | 'SOCIAL_SERVICE_CAF_MORE_3_MONTHS'
  | 'SOCIAL_SERVICE_FRANCE_TRAVAIL_LESS_3_MONTHS'
  | 'SOCIAL_SERVICE_FRANCE_TRAVAIL_MORE_3_MONTHS'
  | 'SOCIAL_SERVICE_FRANCE_TRAVAIL_NOT_YET'
  | 'SOCIAL_SERVICE_APL_LESS_3_MONTHS'
  | 'SOCIAL_SERVICE_APL_MORE_3_MONTHS'
  | 'SOCIAL_SERVICE_APL_NOT_YET'
  | 'SOCIAL_SERVICE_AAH_LESS_3_MONTHS'
  | 'SOCIAL_SERVICE_AAH_MORE_3_MONTHS'
  | 'SOCIAL_SERVICE_AAH_NOT_YET'
  | 'SOCIAL_SERVICE_OTHER'
  | 'PENSION_STATEMENT'
  | 'PENSION_NO_STATEMENT'
  | 'PENSION_DISABILITY_LESS_3_MONTHS'
  | 'PENSION_DISABILITY_MORE_3_MONTHS'
  | 'PENSION_DISABILITY_NOT_YET'
  | 'PENSION_ALIMONY'
  | 'PENSION_UNKNOWN'
  | 'RENT_RENTAL_RECEIPT'
  | 'RENT_RENTAL_NO_RECEIPT'
  | 'RENT_ANNUITY_LIFE'
  | 'RENT_OTHER'

export type TaxCategoryStep =
  | 'TAX_FOREIGN_NOTICE'
  | 'TAX_FRENCH_NOTICE'
  | 'TAX_NOT_RECEIVED'
  | 'TAX_NO_DECLARATION'

export type DocumentCategoryStep = ResidencyStep | FinancialStep | TaxCategoryStep

export class DfDocument {
  id?: number
  path?: string
  documentCategory?: DocumentCategory
  documentSubCategory?: string
  documentCategoryStep?: DocumentCategoryStep
  documentStatus?: DocumentStatus
  customText?: string
  monthlySum?: number
  files?: DfFile[]
  noDocument?: boolean
  name?: string
  documentDeniedReasons?: DocumentDeniedReasons
  authenticityStatus?: string
  documentAnalysisReport?: DocumentAnalysisReport
}
