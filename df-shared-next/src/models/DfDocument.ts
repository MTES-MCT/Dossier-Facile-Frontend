import { DfFile } from './DfFile'
import { DocumentAnalysisReport } from './DocumentAnalysisReport'
import { DocumentDeniedReasons } from './DocumentDeniedReasons'

export type DocumentStatus = 'TO_PROCESS' | 'VALIDATED' | 'DECLINED'

export class DfDocument {
  id?: number
  path?: string
  documentCategory?: string
  documentSubCategory?: string
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
