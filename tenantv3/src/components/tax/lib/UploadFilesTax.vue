<template>
  <AllDeclinedMessages
    v-if="analysisFailedRules.length === 0"
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
  <div v-if="analysisInProgress" class="analysis-loading fr-mb-3w">
    <div class="analysis-loading-status">
      <RiHourglassFill size="24px" class="analysis-loading-icon" aria-hidden="true" />
      <p class="fr-m-0 analysis-loading-text" role="status">{{ t('analysis-in-progress') }}</p>
    </div>
    <div class="analysis-loading-progress">
      <div class="analysis-loading-progress-bar"></div>
    </div>
  </div>
  <TaxAnalysisBanners
    v-if="analysisFailedRules.length > 0"
    :failed-rules="analysisFailedRules"
    class="fr-mb-3w"
    @explain="openExplainSection"
  />
  <FileUpload
    ref="file-upload"
    :current-status="fileUploadStatus"
    :page="4"
    @add-files="addFiles"
  ></FileUpload>
  <div
    v-if="analysisFailedRules.length > 0"
    ref="explain-section"
    class="explain-section"
    tabindex="-1"
  >
    <div class="separator">
      <div class="separator-line"></div>
      <span class="separator-text">{{ t('or') }}</span>
      <div class="separator-line"></div>
    </div>
    <button type="button" class="fr-btn fr-btn--secondary explain-btn" @click="openExplainSection">
      {{ t('explain-situation') }}
    </button>
    <div v-if="showExplainForm" class="explain-form">
      <div class="fr-input-group">
        <label for="explainText" class="fr-label">{{ t('explain-question') }}</label>
        <textarea
          id="explainText"
          ref="explainTextarea"
          v-model="explainText"
          class="fr-input"
          rows="5"
          :placeholder="t('explain-placeholder')"
        />
      </div>
      <p class="fr-info-text">
        {{ t('explain-info') }}
      </p>
      <div class="explain-form-actions">
        <button
          type="button"
          class="fr-btn fr-btn--tertiary fr-btn--sm"
          :disabled="!explainText.trim()"
          @click="saveExplanation"
        >
          {{ t('explain-save') }}
        </button>
      </div>
    </div>
  </div>
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
import AllDeclinedMessages from '@/components/documents/share/AllDeclinedMessages.vue'
import type { TaxCategory } from '@/components/documents/share/DocumentTypeConstants'
import { toast } from '@/components/toast/toastUtils'
import FileUpload from '@/components/uploads/FileUpload.vue'
import ListItem from '@/components/uploads/ListItem.vue'
import { AnalysisService, AnalysisStatus } from '@/services/AnalysisService'
import { AnalyticsService } from '@/services/AnalyticsService'
import { PdfAnalysisService } from '@/services/PdfAnalysisService'
import { RegisterService } from '@/services/RegisterService'
import { UtilsService } from '@/services/UtilsService'
import { useTenantStore } from '@/stores/tenant-store'
import { RiAlarmWarningLine, RiHourglassFill } from '@remixicon/vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import ModalComponent from 'df-shared-next/src/components/ModalComponent.vue'
import type { TaxCategoryStep } from 'df-shared-next/src/models/DfDocument'
import type { DfFile } from 'df-shared-next/src/models/DfFile'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoading } from 'vue-loading-overlay'
import TaxAnalysisBanners from './TaxAnalysisBanners.vue'
import { useTaxState } from './taxState'

const props = defineProps<{ category: TaxCategory; step?: TaxCategoryStep; explanation?: string }>()

const MAX_FILE_COUNT = 5
const POLLING_INTERVAL_MS = 3000
const POLLING_TIMEOUT_MS = 10000

const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const files = ref<{ name: string; file: File; size: number; id?: string; path?: string }[]>([])
const showModale = ref(false)
const showExplainForm = ref(false)
const explainText = ref('')
const explanationSubmitted = ref(false)

const store = useTenantStore()
const taxState = useTaxState()
const fileUpload = useTemplateRef('file-upload')
const explainSection = useTemplateRef<HTMLElement>('explain-section')
const explainTextarea = useTemplateRef<HTMLTextAreaElement>('explainTextarea')
const { t } = useI18n()

const taxDocument = taxState.document
const documentStatus = computed(() => taxDocument.value?.documentStatus)
const analysisFailedRules = ref<DocumentRule[]>([])
const analysisInProgress = ref(false)
const pollingInterval = ref<ReturnType<typeof setInterval> | null>(null)
const pollingTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

function stopPolling() {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
  if (pollingTimeout.value) {
    clearTimeout(pollingTimeout.value)
    pollingTimeout.value = null
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
      analysisInProgress.value = false
      analysisFailedRules.value = data.analysisReport?.failedRules ?? []
      stopPolling()
    } else if (data.status === AnalysisStatus.NO_ANALYSIS_SCHEDULED) {
      analysisInProgress.value = false
      analysisFailedRules.value = []
      stopPolling()
    } else if (data.status === AnalysisStatus.IN_PROGRESS) {
      analysisInProgress.value = true
    }
    // IN_PROGRESS: polling continues
  } catch {
    analysisInProgress.value = false
    analysisFailedRules.value = []
    stopPolling()
  }
}

function startPolling() {
  stopPolling()
  updateAnalysisStatus()
  pollingInterval.value = setInterval(updateAnalysisStatus, POLLING_INTERVAL_MS)
  pollingTimeout.value = setTimeout(() => {
    console.log('polling timeout')
    analysisInProgress.value = false
    stopPolling()
  }, POLLING_TIMEOUT_MS)
}

onMounted(() => {
  const existingComment = taxDocument.value?.documentAnalysisReport?.comment || ''
  explainText.value = existingComment
  explanationSubmitted.value = !!existingComment
  showExplainForm.value = !!existingComment
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

async function openExplainSection() {
  showExplainForm.value = true
  await nextTick()
  explainTextarea.value?.focus()
}

function saveExplanation() {
  const params = {
    documentId: taxDocument.value?.id,
    tenantId: taxState.userId,
    comment: explainText.value
  }
  store.commentAnalysis(params).then(() => {
    explanationSubmitted.value = true
    toast.success(t('save-success'), undefined)
  })
}

defineExpose({ analysisFailedRules, explanationSubmitted, analysisInProgress })

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
  analysisInProgress.value = false
  analysisFailedRules.value = []
  showExplainForm.value = false
  explainText.value = ''
  explanationSubmitted.value = false
  startPolling()
}
</script>

<style scoped>
.analysis-loading {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.analysis-loading-status {
  display: flex;
  align-items: center;
  gap: 3px;
}

.analysis-loading-icon {
  color: var(--blue-france-sun-113-625);
  flex-shrink: 0;
}

.analysis-loading-text {
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #161616;
}

.analysis-loading-progress {
  height: 8px;
  background-color: var(--background-contrast-grey);
  border-radius: 0;
  overflow: hidden;
}

.analysis-loading-progress-bar {
  height: 100%;
  width: 30%;
  background-color: var(--blue-france-sun-113-625);
  animation: indeterminate 1.5s infinite ease-in-out;
}

@keyframes indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(433%);
  }
}

.explain-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
}

.separator {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
  width: 100%;
}

.separator-line {
  flex: 1;
  height: 1px;
  background-color: #ddd;
}

.separator-text {
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: #161616;
}

.explain-btn {
  width: 100%;
  justify-content: center;
}

.explain-form {
  width: 100%;
  margin-top: 1rem;
}

.fr-info-text {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.75rem;
  line-height: 1.25rem;
  color: #0063cb;
  margin: 0.5rem 0;
}

.info-icon {
  color: #0063cb;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.explain-form-actions {
  display: flex;
  justify-content: flex-end;
}
</style>

<i18n>
{
  "en": {
    "analysis-in-progress": "Analyzing documents. This usually takes less than 10 seconds.",
    "or": "OR",
    "explain-situation": "Explain my situation",
    "explain-question": "What difficulty are you encountering to correct this error?",
    "explain-placeholder": "Enter text",
    "explain-info": "This explanation will be sent to our team only. It will not appear in your tenant file.",
    "explain-save": "Save",
    "save-success": "Your explanation has been saved",
    "avis-detected": "Declarative Situation Notice Detected",
    "avis-text1": "You have provided a declarative statement notice (see document title). This document is not valid. Please replace it with your tax assessment notice.",
    "avis-btn": "Submit a valid document",
    "avis-link-to-doc": "Need help ? Check our documentation"
  },
  "fr": {
    "analysis-in-progress": "Analyse des documents. Cela prend généralement moins de 10 secondes.",
    "or": "OU",
    "explain-situation": "Expliquer ma situation",
    "explain-question": "Quelle difficulté rencontrez-vous pour corriger cette erreur ?",
    "explain-placeholder": "Texte saisi",
    "explain-info": "Cette explication sera transmise à notre équipe uniquement. Elle n'apparaîtra pas dans votre dossier locataire.",
    "explain-save": "Enregistrer",
    "save-success": "Votre explication a bien été enregistrée",
    "avis-detected": "Avis de situation déclarative détecté",
    "avis-text1": "Vous avez fourni un avis de situation déclarative (voir titre du document). Ce document n'est pas valide. Merci de le remplacer par votre avis d'imposition.",
    "avis-btn": "Déposer votre avis d'imposition",
    "avis-link-to-doc": "Besoin d'aide ? Consultez notre aide en ligne"
  }
}
</i18n>
