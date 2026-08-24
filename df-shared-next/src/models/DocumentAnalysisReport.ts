import type { DocumentRule } from './DocumentRule'

export type DocumentAnalysisReport = {
  id: number
  analysisStatus: 'DENIED' | 'CHECKED' | 'UNDEFINED'
  failedRules: DocumentRule[]
  passedRules: DocumentRule[]
  inconclusiveRules: DocumentRule[]
  comment?: string
  createdAt: string
}
