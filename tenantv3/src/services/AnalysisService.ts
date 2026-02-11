import axios from 'axios'
import type { DocumentAnalysisReport } from 'df-shared-next/src/models/DocumentAnalysisReport'

export enum AnalysisStatus {
  NO_ANALYSIS_SCHEDULED = 'NO_ANALYSIS_SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export type DocumentAnalysisStatusDTO = {
  documentId: number
  status: AnalysisStatus
  analyzedFiles?: number
  totalFiles?: number
  analysisReport?: DocumentAnalysisReport
}

export type ApplicationAnalysisResponse = {
  listOfDocumentsAnalysisStatus: DocumentAnalysisStatusDTO[]
}

export const AnalysisService = {
  getApplicationAnalysisStatus() {
    return axios.get<ApplicationAnalysisResponse>(
      `${import.meta.env.VITE_API_URL}/api/application/analysis-status`
    )
  },
  getDocumentAnalysisStatus(documentId: number) {
    return axios.get<DocumentAnalysisStatusDTO>(
      `${import.meta.env.VITE_API_URL}/api/document/${documentId}/analysis-status`
    )
  }
}
