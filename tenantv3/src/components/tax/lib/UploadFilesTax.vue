<template>
  <AllDeclinedMessages
    :user-id="taxState.userId"
    :document="taxDocument"
    :document-denied-reasons="taxDocument?.documentDeniedReasons"
    :document-status="documentStatus"
  ></AllDeclinedMessages>
  <div v-if="taxFiles.length > 0" class="fr-col-12 fr-mb-3w">
    <ListItem
      v-for="file in taxFiles"
      :key="file.id"
      :file="file"
      :watermark-url="documentWatermarkUrl"
      doc-category="tax"
      @remove="remove(file)"
      @ask-confirm="AnalyticsService.deleteDocument(taxState.category)"
      @cancel="AnalyticsService.cancelDelete(taxState.category)"
    />
  </div>
  <TaxAnalysisBanners
    v-if="analysisFailedRules.length > 0"
    :failed-rules="analysisFailedRules"
    class="fr-mb-3w"
  />
  <FileUpload
    ref="file-upload"
    :current-status="fileUploadStatus"
    :page="4"
    @add-files="addFiles"
  ></FileUpload>
  <ModalComponent v-if="showModale" @close="showModale = false">
    <template #body>
      <div class="fr-pl-md-3w fr-pr-md-3w fr-pb-md-3w">
        <h1 class="fr-h4 display--flex align-items--center">
          <RiAlarmWarningLine class="bold-icon fr-mr-1w" aria-hidden="true" />
          {{ t('avis-detected') }}
        </h1>
        <p>
          {{ t('avis-text1') }}
        </p>
        <hr class="mobile" />
        <DfButton primary @click="showModale = false">{{ t('avis-btn') }}</DfButton>
        <p class="fr-mt-2w fr-mb-0">
          <a
            href="https://aide.dossierfacile.logement.gouv.fr/fr/article/5-avis-dimposition-eg82wt/"
            :title="`${t('avis-link-to-doc')} - ${t('new-window')}`"
            rel="noopener"
            target="_blank"
            >{{ t('avis-link-to-doc') }}</a
          >
        </p>
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import FileUpload from '@/components/uploads/FileUpload.vue'
import ListItem from '@/components/uploads/ListItem.vue'
import AllDeclinedMessages from '@/components/documents/share/AllDeclinedMessages.vue'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useTenantStore } from '@/stores/tenant-store'
import { RegisterService } from '@/services/RegisterService'
import { AnalysisService, AnalysisStatus } from '@/services/AnalysisService'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import type { DfFile } from 'df-shared-next/src/models/DfFile'
import { UtilsService } from '@/services/UtilsService'
import { useLoading } from 'vue-loading-overlay'
import { toast } from '@/components/toast/toastUtils'
import { useI18n } from 'vue-i18n'
import { useTaxState } from './taxState'
import type { TaxCategory } from '@/components/documents/share/DocumentTypeConstants'
import type { TaxCategoryStep } from 'df-shared-next/src/models/DfDocument'
import { PdfAnalysisService } from '@/services/PdfAnalysisService'
import ModalComponent from 'df-shared-next/src/components/ModalComponent.vue'
import { RiAlarmWarningLine } from '@remixicon/vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import TaxAnalysisBanners from './TaxAnalysisBanners.vue'

const props = defineProps<{ category: TaxCategory; step?: TaxCategoryStep; explanation?: string }>()

const MAX_FILE_COUNT = 5
const POLLING_INTERVAL_MS = 3000

const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const files = ref<{ name: string; file: File; size: number; id?: string; path?: string }[]>([])
const showModale = ref(false)

const store = useTenantStore()
const taxState = useTaxState()
const fileUpload = useTemplateRef('file-upload')
const { t } = useI18n()

const taxDocument = taxState.document
const documentStatus = computed(() => taxDocument.value?.documentStatus)
const analysisFailedRules = ref<DocumentRule[]>([])
const pollingInterval = ref<ReturnType<typeof setInterval> | null>(null)

function stopPolling() {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
}

async function updateAnalysisStatus() {
  const docId = taxDocument.value?.id
  if (!docId) {
    stopPolling()
    return
  }
  try {
    const { data } = await AnalysisService.getDocumentAnalysisStatus(docId)
    console.log(`[analysis-status] document ${docId}:`, JSON.stringify(data, null, 2))
    if (data.status === AnalysisStatus.COMPLETED) {
      analysisFailedRules.value = data.analysisReport?.failedRules ?? []
      stopPolling()
    } else if (data.status === AnalysisStatus.NO_ANALYSIS_SCHEDULED) {
      analysisFailedRules.value = []
      stopPolling()
    }
    // IN_PROGRESS: polling continues
  } catch {
    analysisFailedRules.value = []
    stopPolling()
  }
}

function startPolling() {
  stopPolling()
  updateAnalysisStatus()
  pollingInterval.value = setInterval(updateAnalysisStatus, POLLING_INTERVAL_MS)
}

onMounted(() => {
  startPolling()
})

onBeforeUnmount(() => {
  stopPolling()
})

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
      startPolling()
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
    showModale.value = true
    return
  }
  save()
}

defineExpose({ analysisFailedRules })

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

<i18n>
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
