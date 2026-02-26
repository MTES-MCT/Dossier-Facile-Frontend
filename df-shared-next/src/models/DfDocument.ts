import { DfFile } from './DfFile'
import type { DocumentAnalysisReport } from './DocumentAnalysisReport'
import { DocumentDeniedReasons } from './DocumentDeniedReasons'

export type DocumentStatus = 'TO_PROCESS' | 'VALIDATED' | 'DECLINED'

export const allTenantDocumentCategories: DocumentCategory[] = [
  'IDENTIFICATION',
  'RESIDENCY',
  'PROFESSIONAL',
  'FINANCIAL',
  'TAX'
]

export const guarantorLegalPersonCategories: DocumentCategory[] = [
  'IDENTIFICATION_LEGAL_PERSON',
  'IDENTIFICATION'
]

export const guarantorOrganismCategories: DocumentCategory[] = ['GUARANTEE_PROVIDER_CERTIFICATE']

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

export const STEP_LABEL: { [P in DocumentCategoryStep]?: string } = {
  SALARY_EMPLOYED_LESS_3_MONTHS: 'documents.financial-steps.salary',
  SALARY_EMPLOYED_MORE_3_MONTHS: 'documents.financial-steps.salary',
  SALARY_EMPLOYED_NOT_YET: 'documents.financial-steps.salary',
  SALARY_FREELANCE_AUTOENTREPRENEUR: 'documents.financial-steps.freelance',
  SALARY_FREELANCE_OTHER: 'documents.financial-steps.freelance',
  SALARY_INTERMITTENT: 'documents.financial-steps.intermitent',
  SALARY_ARTIST_AUTHOR: 'documents.financial-steps.artist-author',
  SALARY_UNKNOWN: 'documents.financial-steps.unknown',
  SOCIAL_SERVICE_CAF_LESS_3_MONTHS: 'documents.financial-steps.caf-or-msa',
  SOCIAL_SERVICE_CAF_MORE_3_MONTHS: 'documents.financial-steps.caf-or-msa',
  SOCIAL_SERVICE_FRANCE_TRAVAIL_LESS_3_MONTHS: 'documents.financial-steps.france-travail',
  SOCIAL_SERVICE_FRANCE_TRAVAIL_MORE_3_MONTHS: 'documents.financial-steps.france-travail',
  SOCIAL_SERVICE_FRANCE_TRAVAIL_NOT_YET: 'documents.financial-steps.france-travail',
  SOCIAL_SERVICE_APL_LESS_3_MONTHS: 'documents.financial-steps.apl',
  SOCIAL_SERVICE_APL_MORE_3_MONTHS: 'documents.financial-steps.apl',
  SOCIAL_SERVICE_APL_NOT_YET: 'documents.financial-steps.apl',
  SOCIAL_SERVICE_AAH_LESS_3_MONTHS: 'documents.financial-steps.aah',
  SOCIAL_SERVICE_AAH_MORE_3_MONTHS: 'documents.financial-steps.aah',
  SOCIAL_SERVICE_AAH_NOT_YET: 'documents.financial-steps.aah',
  SOCIAL_SERVICE_OTHER: 'documents.financial-steps.other-help',
  PENSION_STATEMENT: 'documents.financial-steps.pension',
  PENSION_NO_STATEMENT: 'documents.financial-steps.pension',
  PENSION_DISABILITY_LESS_3_MONTHS: 'documents.financial-steps.disability-pension',
  PENSION_DISABILITY_MORE_3_MONTHS: 'documents.financial-steps.disability-pension',
  PENSION_DISABILITY_NOT_YET: 'documents.financial-steps.disability-pension',
  PENSION_ALIMONY: 'documents.financial-steps.alimony-pension',
  PENSION_UNKNOWN: 'documents.financial-steps.unknown-pension',
  RENT_RENTAL_RECEIPT: 'documents.financial-steps.rent',
  RENT_RENTAL_NO_RECEIPT: 'documents.financial-steps.rent',
  RENT_ANNUITY_LIFE: 'documents.financial-steps.rent-annuity-life',
  RENT_OTHER: 'documents.financial-steps.rent-other'
}

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
