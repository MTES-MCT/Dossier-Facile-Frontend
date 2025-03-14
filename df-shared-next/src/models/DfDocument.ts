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

export type DocumentCategoryStep =
  | 'TENANT_RECEIPT'
  | 'TENANT_PROOF'
  | 'GUEST_PROOF'
  | 'GUEST_NO_PROOF'

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
