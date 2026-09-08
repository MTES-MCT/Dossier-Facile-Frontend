<template>
  <AnalysisWrapper
    ref="analysis-wrapper"
    :is-uploading="isUploading"
    :polling-timeout-ms="10000"
    :strategy="professionalStrategy"
  >
    <template #fileUploader>
      <UploadFileWithAnalysis
        ref="upload-file-with-analysis"
        :doc-category="stateCategory"
        :sub-category="category"
        :analysis-in-progress="analysisInProgress"
        :max-file-count="MAX_FILE_COUNT"
        :analysis-time="10000"
      />
    </template>
  </AnalysisWrapper>
  <AnalysisFooter
    :previous-step="mainActivityState.previousStep"
    :before-submit="analysisWrapper?.beforeSubmit"
    :next-disabled="analysisFooterNextDisabled"
    :next-label="analysisWrapper?.nextLabel"
    :on-submit-action="submit"
  />
</template>

<script setup lang="ts">
import { computed, provide, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import AnalysisWrapper from '@/components/analysis/AnalysisWrapper.vue'
import UploadFileWithAnalysis from '@/components/analysis/UploadFileWithAnalysis.vue'
import {
  IA_SUPPORTED_PROFESSIONAL_CATEGORIES,
  ProfessionalAnalysisErrorStrategy
} from '@/components/analysis/strategies/ProfessionalAnalysisErrorStrategy'
import AnalysisFooter from '@/components/footer/AnalysisFooter.vue'
import { documentFormKey } from '@/components/documents/documentFormState'
import { AnalyticsService } from '@/services/AnalyticsService'
import type { MainActivityCategory } from '@/components/documents/share/DocumentTypeConstants'
import { useMainActivityState } from './mainActivityState'

const props = defineProps<{ category: MainActivityCategory }>()

const MAX_FILE_COUNT = 20

const router = useRouter()
const mainActivityState = useMainActivityState()

const stateCategory = mainActivityState.category
const mainActivityDocument = mainActivityState.document
const userId = mainActivityState.userId

const uploadFileWithAnalysis = useTemplateRef('upload-file-with-analysis')
const analysisWrapper = useTemplateRef('analysis-wrapper')

const isUploading = computed(() => uploadFileWithAnalysis.value?.isUploading ?? false)
const analysisInProgress = computed(() => analysisWrapper.value?.analysisInProgress ?? false)

const professionalStrategy = computed(() => {
  if (IA_SUPPORTED_PROFESSIONAL_CATEGORIES.includes(props.category)) {
    return new ProfessionalAnalysisErrorStrategy(props.category.toLowerCase())
  }
  return undefined
})

const analysisFooterNextDisabled = computed(() => {
  const busy = Boolean(analysisWrapper.value?.nextDisabled)
  const noFiles = (mainActivityDocument.value?.files?.length ?? 0) === 0
  return busy || noFiles
})

provide(documentFormKey, {
  category: 'PROFESSIONAL',
  textKey: mainActivityState.textKey,
  previousStep: mainActivityState.previousStep,
  nextStep: mainActivityState.nextStep,
  formFieldValue: 'typeDocumentProfessional',
  document: mainActivityDocument,
  storeAction: mainActivityState.action,
  userId: userId,
  addData: (formData: FormData) => {
    mainActivityState.addData?.(formData)
  }
})

async function submit() {
  await analysisWrapper.value?.saveExplanation()
  AnalyticsService.validateFunnelStep(stateCategory)
  await router.push(mainActivityState.nextStep)
}
</script>
