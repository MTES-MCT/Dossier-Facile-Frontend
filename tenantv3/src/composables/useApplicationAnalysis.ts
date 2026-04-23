import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  AnalysisService,
  AnalysisStatus,
  type DocumentAnalysisStatusDTO
} from '@/services/AnalysisService'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { useTenantStore } from '@/stores/tenant-store'
import type { DocumentAnalysisReport } from 'df-shared-next/src/models/DocumentAnalysisReport'

export const useApplicationAnalysis = () => {
  const store = useTenantStore()
  const pollingInterval = ref<ReturnType<typeof setInterval> | null>(null)
  const timeoutId = ref<ReturnType<typeof setTimeout> | null>(null)
  const isTimeout = ref(false)

  const timeoutDuration = 1 * 60 * 1000 // 1 minute

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
      !isTimeout.value &&
      analysisResults.value.numberOfDocuments > 0 &&
      analysisResults.value.numberOfAnalysedDocuments < analysisResults.value.numberOfDocuments
    )
  })

  const hasAllGuarantorsIdentityDefined = computed(() => {
    const isGuarantorIdentityDefined = (guarantor: Guarantor) => {
      if (guarantor.typeGuarantor === 'ORGANISM') {
        return true
      }

      const firstName = guarantor.firstName?.trim()
      const lastName = guarantor.lastName?.trim()
      return firstName && lastName
    }

    const guarantorsFromMainTenant = store.user.guarantors ?? []
    const mainTenantIsValid = guarantorsFromMainTenant.every(isGuarantorIdentityDefined)
    if (!mainTenantIsValid) {
      return false
    }

    if (store.user.applicationType !== 'COUPLE') {
      return true
    }

    const coTenants =
      store.user.apartmentSharing?.tenants.filter((tenant) => tenant.id !== store.user.id) ?? []

    return coTenants.every((tenant) => (tenant.guarantors ?? []).every(isGuarantorIdentityDefined))
  })

  const isApplicationOk = computed(() => {
    return (
      !isAnalyseInProgress.value &&
      analysisResults.value.documentAnalysisStatus.every((s) => {
        return s.isValid || (!s.isValid && s.analysisReport?.comment !== undefined)
      }) &&
      store.allDocumentsPreValidated &&
      hasAllGuarantorsIdentityDefined.value
    )
  })

  const stopPolling = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value)
      pollingInterval.value = null
    }
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
      timeoutId.value = null
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
    isTimeout.value = false
    timeoutId.value = setTimeout(() => {
      isTimeout.value = true
    }, timeoutDuration)

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
    isApplicationOk
  }
}
