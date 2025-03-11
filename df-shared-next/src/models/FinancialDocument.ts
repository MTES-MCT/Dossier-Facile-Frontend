import { DfFile } from './DfFile'
import { UploadStatus } from './UploadStatus'
import { DocumentType } from './Document'
import { DocumentAnalysisReport } from './DocumentAnalysisReport'
import type { DocumentCategory } from './DfDocument'

export class FinancialDocument {
  id?: number
  documentType = new DocumentType()
  documentCategory?: DocumentCategory
  documentSubCategory?:
    | 'SALARY'
    | 'SCHOLARSHIP'
    | 'SOCIAL_SERVICE'
    | 'RENT'
    | 'PENSION'
    | 'NO_INCOME'
  noDocument = false
  files: DfFile[] = []
  fileUploadStatus = UploadStatus.STATUS_INITIAL
  customText = ''
  monthlySum?: number
  documentAnalysisReport?: DocumentAnalysisReport
}
