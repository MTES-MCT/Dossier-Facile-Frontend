import type { DocumentRule } from './DocumentRule'

export type DocumentAnalysisStatus = 'DENIED' | 'CHECKED' | 'UNDEFINED'

export type DocumentAnalysisReport = {
  id: number
  analysisStatus: DocumentAnalysisStatus
  failedRules: DocumentRule[]
  passedRules: DocumentRule[]
  inconclusiveRules: DocumentRule[]
  comment?: string
  createdAt: string
}
