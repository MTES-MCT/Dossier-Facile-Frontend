<template>
  <UploadFileWithAnalysis
    ref="upload-file-with-analysis"
    doc-category="tax"
    :sub-category="subCategory"
    :step="step"
    :max-file-count="5"
    :analysis-in-progress="analysisInProgress"
    :before-save="canContinue"
  >
    <template #custom>
      <DsfrModalPatch
        v-model:is-opened="isModalOpened"
        :title="t('avis-detected')"
        icon="ri:alarm-warning-line"
        :actions="modalActions"
      >
        <p>
          {{ t('avis-text1') }}
        </p>
        <p>
          <a
            href="https://aide.dossierfacile.logement.gouv.fr/fr/article/5-avis-dimposition-eg82wt/"
            :title="`${t('avis-link-to-doc')} - ${t('new-window')}`"
            rel="noopener"
            target="_blank"
            >{{ t('avis-link-to-doc') }}</a
          >
        </p>
      </DsfrModalPatch>
    </template>
  </UploadFileWithAnalysis>
</template>

<script setup lang="ts">
import type { DocumentSubCategory } from '@/components/documents/share/DocumentTypeConstants'
import { PdfAnalysisService } from '@/services/PdfAnalysisService'
import type { DsfrButtonProps } from '@gouvminint/vue-dsfr'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import type { DocumentCategoryStep } from 'df-shared-next/src/models/DfDocument'
import { computed, ref, useTemplateRef, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import UploadFileWithAnalysis from '../../analysis/UploadFileWithAnalysis.vue'

const isModalOpened = ref(false)
type UploadFileWithAnalysisRef = {
  isUploading?: boolean
  forceUploadPendingFiles?: () => Promise<boolean>
}

const uploadFileWithAnalysis = useTemplateRef<UploadFileWithAnalysisRef>(
  'upload-file-with-analysis'
)

export type UploadFileTaxWithAnalysisExposed = {
  isUploading: boolean
  forceUploadPendingFiles: () => Promise<boolean>
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
  },
  async forceUploadPendingFiles() {
    return (await uploadFileWithAnalysis.value?.forceUploadPendingFiles?.()) ?? false
  }
})

async function canContinue(fileList: File[]): Promise<boolean> {
  if (await PdfAnalysisService.includesRejectedTaxDocuments(fileList)) {
    isModalOpened.value = true
    return false
  }
  return true
}

const modalActions: ComputedRef<DsfrButtonProps[]> = computed(() => [
  {
    label: t('avis-btn'),
    type: 'button',
    onClick() {
      void forceUploadAfterOverride()
    }
  }
])

async function forceUploadAfterOverride() {
  isModalOpened.value = false
  await uploadFileWithAnalysis.value?.forceUploadPendingFiles?.()
}

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "avis-detected": "Declarative Situation Notice Detected",
    "avis-text1": "You have provided a declarative statement notice (see document title). This document is not valid. Please replace it with your tax assessment notice.",
    "avis-btn": "Submit a valid document",
    "avis-link-to-doc": "Need help ? Check our documentation"
  },
  "fr": {
    "avis-detected": "Avis de situation déclarative détecté",
    "avis-text1": "Vous avez fourni un avis de situation déclarative (voir titre du document). Ce document n'est pas valide. Merci de le remplacer par votre avis d'imposition.",
    "avis-btn": "Déposer votre avis d'imposition",
    "avis-link-to-doc": "Besoin d'aide ? Consultez notre aide en ligne"
  }
}
</i18n>
