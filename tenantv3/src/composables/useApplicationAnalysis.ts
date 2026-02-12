import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  AnalysisService,
  AnalysisStatus,
  type DocumentAnalysisStatusDTO
} from '@/services/AnalysisService'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import { useTenantStore } from '@/stores/tenant-store'
import type { DocumentAnalysisReport } from 'df-shared-next/src/models/DocumentAnalysisReport'

export const useApplicationAnalysis = () => {
  const store = useTenantStore()
  const pollingInterval = ref<ReturnType<typeof setInterval> | null>(null)

  const analysisResults = ref({
    numberOfDocuments: 0,
    numberOfAnalysedDocuments: 0,
    documentAnalysisStatus: [] as {
      id: number
      isFinished: boolean
      isValid: boolean
      failedRules?: DocumentRule[]
      analysisReport?: DocumentAnalysisReport
    }[]
  })

  const isAnalyseInProgress = computed(() => {
    return (
      analysisResults.value.numberOfDocuments > 0 &&
      analysisResults.value.numberOfAnalysedDocuments < analysisResults.value.numberOfDocuments
    )
  })

  const isApplicationOk = computed(() => {
    return (
      !isAnalyseInProgress.value &&
      analysisResults.value.documentAnalysisStatus.every((s) => {
        return s.isValid || (!s.isValid && s.analysisReport?.comment !== undefined)
      }) &&
      store.allDocumentsPreValidated
    )
  })

  const hasErrors = computed(() => {
    return !isAnalyseInProgress.value && !isApplicationOk.value
  })

  const stopPolling = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value)
      pollingInterval.value = null
    }
  }

  const updateAnalysisStatus = async () => {
    try {
      const response = await AnalysisService.getApplicationAnalysisStatus()
      const data = response.data

      const mappedStatus = data.listOfDocumentsAnalysisStatus.map(
        (s: DocumentAnalysisStatusDTO) => {
          const isFinished = s.status !== AnalysisStatus.IN_PROGRESS
          const isValid = !(
            s.status === AnalysisStatus.COMPLETED && s.analysisReport?.analysisStatus === 'DENIED'
          )
          return {
            id: s.documentId,
            isFinished,
            isValid,
            failedRules: s.analysisReport?.failedRules,
            analysisReport: s.analysisReport
          }
        }
      )

      const analysedCount = mappedStatus.filter((s) => s.isFinished).length

      analysisResults.value = {
        numberOfDocuments: mappedStatus.length,
        numberOfAnalysedDocuments: analysedCount,
        documentAnalysisStatus: mappedStatus
      }

      const allFinished = mappedStatus.every((s) => s.isFinished)
      if (allFinished) {
        stopPolling()
      }
    } catch (error) {
      console.error('Failed to fetch analysis status', error)
      stopPolling()
    }
  }

  const startPolling = () => {
    stopPolling() // Ensure no duplicates
    updateAnalysisStatus() // Initial call
    // Poll every 3 seconds
    pollingInterval.value = setInterval(updateAnalysisStatus, 3000)
  }

  onMounted(() => {
    startPolling()
  })

  onBeforeUnmount(() => {
    stopPolling()
  })

  return {
    analysisResults,
    isAnalyseInProgress,
    isApplicationOk,
    hasErrors
  }
}
