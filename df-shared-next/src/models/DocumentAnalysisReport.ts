import { DocumentRule } from './DocumentRule'
export class DocumentAnalysisReport {
  analysisStatus?: string
  failedRules?: DocumentRule[]
  comment?: string
}
