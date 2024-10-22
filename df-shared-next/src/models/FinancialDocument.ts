import { DfFile } from './DfFile'
import { UploadStatus } from './UploadStatus'
import { DocumentType } from './Document'
import { DocumentAnalysisReport } from './DocumentAnalysisReport'

export class FinancialDocument {
  id?: number
  documentType = new DocumentType()
  documentCategory?: string
  documentSubCategory?: string
  noDocument = false
  files: DfFile[] = []
  fileUploadStatus = UploadStatus.STATUS_INITIAL
  customText = ''
  monthlySum?: number
  documentAnalysisReport?: DocumentAnalysisReport
}
