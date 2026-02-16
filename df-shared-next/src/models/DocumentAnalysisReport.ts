import type { DocumentRule } from './DocumentRule'

export type DocumentAnalysisReport = {
  id: number
  analysisStatus: 'DENIED' | 'CHECKED' | 'VALIDATED'
  failedRules: DocumentRule[]
  passedRules: DocumentRule[]
  inconclusiveRules: DocumentRule[]
  comment: string | null
  createdAt: string
}
