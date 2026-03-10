<template>
  <AllDeclinedMessages
    :user-id="taxState.userId"
    :document="taxDocument"
    :document-denied-reasons="taxDocument?.documentDeniedReasons"
    :document-status="documentStatus"
  ></AllDeclinedMessages>
  <ul v-if="taxFiles.length > 0" role="list" class="fr-col-12 fr-mb-3w">
    <li v-for="file in taxFiles" :key="file.id">
      <ListItem
        :file="file"
        :watermark-url="documentWatermarkUrl"
        doc-category="tax"
        @remove="remove(file)"
        @ask-confirm="AnalyticsService.deleteDocument(taxState.category)"
        @cancel="AnalyticsService.cancelDelete(taxState.category)"
      />
    </li>
  </ul>
  <FileUpload
    ref="file-upload"
    :current-status="fileUploadStatus"
    :page="4"
    @add-files="addFiles"
  />
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

<script setup lang="ts">
import { computed, ref, useTemplateRef, type ComputedRef } from 'vue'
import FileUpload from '@/components/uploads/FileUpload.vue'
import ListItem from '@/components/uploads/ListItem.vue'
import AllDeclinedMessages from '@/components/documents/share/AllDeclinedMessages.vue'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useTenantStore } from '@/stores/tenant-store'
import { RegisterService } from '@/services/RegisterService'
import type { DfFile } from 'df-shared-next/src/models/DfFile'
import { UtilsService } from '@/services/UtilsService'
import { useLoading } from 'vue-loading-overlay'
import { toast } from '@/components/toast/toastUtils'
import { useI18n } from 'vue-i18n'
import { useTaxState } from './taxState'
import type { TaxCategory } from '@/components/documents/share/DocumentTypeConstants'
import type { TaxCategoryStep } from 'df-shared-next/src/models/DfDocument'
import { PdfAnalysisService } from '@/services/PdfAnalysisService'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import type { DsfrButtonProps } from '@gouvminint/vue-dsfr'

const props = defineProps<{ category: TaxCategory; step?: TaxCategoryStep; explanation?: string }>()

const MAX_FILE_COUNT = 5

const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const files = ref<{ name: string; file: File; size: number; id?: string; path?: string }[]>([])

const isModalOpened = ref(false)
const modalActions: ComputedRef<DsfrButtonProps[]> = computed(() => [
  {
    label: t('avis-btn'),
    type: 'button',
    onClick() {
      isModalOpened.value = false
    }
  }
])

const store = useTenantStore()
const taxState = useTaxState()
const fileUpload = useTemplateRef('file-upload')
const { t } = useI18n()

const taxDocument = taxState.document
const documentStatus = computed(() => taxDocument.value?.documentStatus)

const taxFiles = computed(() => {
  const newFiles = files.value.map((f) => {
    return {
      documentSubCategory: props.category,
      id: f.id,
      name: f.name,
      size: f.size
    }
  })
  const existingFiles = taxDocument.value?.files || []
  return [...newFiles, ...existingFiles]
})

const documentWatermarkUrl = computed(() => taxDocument.value?.name)

async function save(): Promise<boolean> {
  const formData = new FormData()
  const newFiles = files.value.filter((f) => {
    return !f.id
  })
  if (!newFiles.length) {
    return true
  }

  if (taxFiles.value.length > MAX_FILE_COUNT) {
    toast.maxFileError(taxFiles.value.length, MAX_FILE_COUNT, fileUpload.value?.inputFile)
    files.value = []
    return false
  }

  for (const [key, newFile] of newFiles.entries()) {
    const f = newFile.file || new File([], '')
    formData.append(`documents[${key}]`, f, newFile.name)
  }

  formData.append('typeDocumentTax', props.category)
  if (props.step) {
    formData.append('categoryStep', props.step)
  }
  formData.append('noDocument', String(newFiles.length === 0))
  if (props.explanation) {
    formData.append('customText', props.explanation)
  }
  taxState.addData?.(formData)

  fileUploadStatus.value = UploadStatus.STATUS_SAVING
  const $loading = useLoading()
  const loader = $loading.show()
  return await store[taxState.action](formData)
    .then(() => {
      files.value = []
      fileUploadStatus.value = UploadStatus.STATUS_INITIAL
      toast.success(t('file-saved'), fileUpload.value?.inputFile)
      return true
    })
    .catch((err) => {
      fileUploadStatus.value = UploadStatus.STATUS_FAILED
      UtilsService.handleCommonSaveError(err, fileUpload.value?.inputFile)
      return false
    })
    .finally(() => {
      loader.hide()
    })
}

async function addFiles(fileList: File[]) {
  AnalyticsService.uploadFile(taxState.category, props.category)
  const nf = Array.from(fileList).map((f) => {
    return { name: f.name, file: f, size: f.size }
  })
  files.value = [...files.value, ...nf]
  if (await PdfAnalysisService.includesRejectedTaxDocuments(fileList)) {
    isModalOpened.value = true
    return
  }
  save()
}

async function remove(file: DfFile, silent = false) {
  AnalyticsService.deleteFile(taxState.category)
  if (file.id) {
    if (
      taxDocument.value?.files?.length === 1 &&
      taxDocument.value?.documentAnalysisReport?.analysisStatus === 'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(taxDocument.value?.documentSubCategory || '')
    }
    await RegisterService.deleteFile(file.id, silent)
  } else {
    const firstIndex = files.value.findIndex((f) => f.name === file.name && !f.path)
    files.value.splice(firstIndex, 1)
  }
}
</script>

<style scoped>
ul {
  --li-bottom: 1rem;
}
</style>

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
    "avis-text1": "Vous avez fourni un avis de situation déclarative (voir titre du document). Ce document n’est pas valide. Merci de le remplacer par votre avis d’imposition.",
    "avis-btn": "Déposer votre avis d’imposition",
    "avis-link-to-doc": "Besoin d’aide ? Consultez notre aide en ligne"
  }
}
</i18n>
