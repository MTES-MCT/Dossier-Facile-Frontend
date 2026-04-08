<template>
  <UploadFileWithAnalysis
    ref="upload-file-with-analysis"
    doc-category="tax"
    :sub-category="subCategory"
    :step="step"
    :max-file-count="5"
    :analysis-in-progress="analysisInProgress"
    :before-save="canContinue"
  />
</template>

<script setup lang="ts">
import { toast } from '@/components/toast/toastUtils'
import type { DocumentSubCategory } from '@/components/documents/share/DocumentTypeConstants'
import { AnalyticsService } from '@/services/AnalyticsService'
import { PdfAnalysisService } from '@/services/PdfAnalysisService'
import type { DocumentCategoryStep } from 'df-shared-next/src/models/DfDocument'
import { useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import UploadFileWithAnalysis from '../../analysis/UploadFileWithAnalysis.vue'

type UploadFileWithAnalysisRef = {
  isUploading?: boolean
}

const uploadFileWithAnalysis = useTemplateRef<UploadFileWithAnalysisRef>(
  'upload-file-with-analysis'
)

export type UploadFileTaxWithAnalysisExposed = {
  isUploading: boolean
}

withDefaults(
  defineProps<{
    analysisInProgress?: boolean
    subCategory: DocumentSubCategory
    step: DocumentCategoryStep
    explanation?: string
  }>(),
  { analysisInProgress: false, explanation: undefined }
)

defineExpose<UploadFileTaxWithAnalysisExposed>({
  get isUploading() {
    return uploadFileWithAnalysis.value?.isUploading ?? false
  }
})

const { t } = useI18n()

async function canContinue(fileList: File[]): Promise<boolean> {
  if (await PdfAnalysisService.includesRejectedTaxDocuments(fileList)) {
    toast.error(t('asdir-error'), document.getElementById('file'))
    AnalyticsService.asdirDetected()
    return false
  }
  return true
}
</script>

<i18n lang="json">
{
  "en": {
    "asdir-error": "The declarative situation notice is not accepted. Please upload your tax notice."
  },
  "fr": {
    "asdir-error": "L'avis de situation déclarative n'est pas accepté. Merci de déposer votre avis d'impôt."
  }
}
</i18n>
