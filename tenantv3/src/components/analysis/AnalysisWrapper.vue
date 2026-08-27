<template>
  <template v-if="strategy">
    <AnalysisErrorBlock
      v-if="analysisErrorCount > 0"
      ref="analysis-error-block"
      v-model="explainText"
      :failed-rules="analysisFailedRules ?? []"
      :strategy="strategy"
      :has-explain-error="showExplainError"
      @custom-event="(eventName) => emit('customEvent', eventName)"
    />
  </template>
  <template v-else>
    <DsfrBadge
      v-if="analysisErrorCount > 0"
      type="warning"
      :label="t('errors-count', { count: analysisErrorCount }, analysisErrorCount)"
      class="fr-mb-2w"
    />
    <slot name="fileSpecificDescription" />
    <AnalysisBanners
      v-if="analysisErrorCount > 0"
      ref="analysis-banner"
      :failed-rules="analysisFailedRules ?? []"
      :document="document"
      class="fr-mb-3w"
      @explain="(text) => openExplainSection(true, text)"
    >
      <template #errorContent="slotProps">
        <slot name="analysisBannerError" v-bind="slotProps" />
      </template>
    </AnalysisBanners>
  </template>
  <div
    v-if="isAnalysisTerminated"
    class="analysis-success-card fr-mb-3w"
    role="status"
    aria-live="polite"
  >
    <VIcon
      name="ri:checkbox-circle-line"
      :scale="1.2"
      color="var(--blue-france-sun-113-625)"
      class="analysis-success-icon"
      aria-hidden="true"
    />
    <span class="analysis-success-title">
      {{ t('analysis-completed') }}
    </span>
  </div>
  <slot name="fileUploader" />
  <div v-if="!strategy && analysisFailedRules.length > 0" class="explain-section">
    <div class="separator">
      <div class="separator-line"></div>
      <span class="separator-text">{{ t('or') }}</span>
      <div class="separator-line"></div>
    </div>
    <DsfrButton
      type="button"
      secondary
      class="explain-btn"
      :label="t('explain-situation')"
      @click="openExplainSection(false)"
    />
    <div v-if="showExplainForm" class="explain-form">
      <div class="fr-input-group" :class="{ 'fr-input-group--error': isExplainError }">
        <label for="explainText" class="fr-label">{{ t('explain-question') }}</label>
        <textarea
          id="explainText"
          ref="explainTextarea"
          v-model="explainText"
          class="fr-input"
          :class="{ 'fr-input--error': isExplainError }"
          rows="5"
          :placeholder="t('explain-placeholder')"
          aria-describedby="explainText-error explainText-info"
          @blur="onExplainBlur"
        />
        <p v-if="isExplainError" id="explainText-error" class="fr-error-text">
          {{ explainErrorMessage }}
        </p>
      </div>
      <p id="explainText-info" class="fr-info-text">
        {{ t('explain-info') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AnalysisService, AnalysisStatus } from '@/services/AnalysisService'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useTenantStore } from '@/stores/tenant-store'
import { DsfrBadge, DsfrButton, VIcon } from '@gouvminint/vue-dsfr'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import debounce from 'lodash.debounce'
import { computed, nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AnalysisBanners from '../analysis/AnalysisBanners.vue'
import AnalysisErrorBlock from '../analysis/AnalysisErrorBlock.vue'
import type { BaseAnalysisErrorStrategy } from '../analysis/strategies/BaseAnalysisErrorStrategy'
import { useDocumentFormKey } from '../documents/documentFormState'
import { toast } from '../toast/toastUtils'

const POLLING_INTERVAL_MS = 3000
const POLLING_TIMEOUT_MS = 10000
const SAVE_DEBOUNCE_MS = 1000

const emit = defineEmits<{
  customEvent: [eventName: string]
}>()

const props = withDefaults(
  defineProps<{
    isUploading?: boolean
    pollingTimeoutMs?: number
    strategy?: BaseAnalysisErrorStrategy
  }>(),
  {
    isUploading: false,
    pollingTimeoutMs: POLLING_TIMEOUT_MS,
    strategy: undefined
  }
)

const { t } = useI18n()

const { document } = useDocumentFormKey()

const analysisFailedRules = ref<DocumentRule[]>(
  document.value?.documentAnalysisReport?.failedRules ?? []
)
const analysisInProgress = ref(false)
const pollingInterval = ref<ReturnType<typeof setInterval> | null>(null)
const pollingTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
const analysisBanner = useTemplateRef('analysis-banner')
const analysisErrorBlock = useTemplateRef('analysis-error-block')
const showExplainForm = ref(false)
const showExplainError = ref(false)
const explainText = ref('')
const explainTextarea = useTemplateRef<HTMLTextAreaElement>('explainTextarea')
const explanationSubmitted = ref(false)
let pendingSave: Promise<boolean> | null = null

const analysisErrorCount = computed(() => analysisFailedRules.value?.length ?? 0)
const isAnalysisTerminated = computed(() => {
  const report = document.value?.documentAnalysisReport
  if (!report || analysisInProgress.value) {
    return false
  }
  const hasNoFailed = (report.failedRules?.length ?? 0) === 0
  const hasPassedOrInconclusive =
    (report.passedRules?.length ?? 0) > 0 || (report.inconclusiveRules?.length ?? 0) > 0

  return hasNoFailed && hasPassedOrInconclusive
})
const isBusy = computed(() => analysisInProgress.value || props.isUploading)
const nextDisabled = computed(() => isBusy.value)

const store = useTenantStore()

const nextLabel = computed(() => {
  if (props.isUploading) return t('uploading')
  if (analysisInProgress.value) return t('analyzing')
  return undefined
})

defineExpose({
  focusBanners,
  analysisInProgress,
  analysisFailedRules,
  explanationSubmitted,
  nextDisabled,
  nextLabel,
  beforeSubmit,
  saveExplanation,
  explainText
})

function focusBanners() {
  if (props.strategy) {
    analysisErrorBlock.value?.focus()
  } else {
    analysisBanner.value?.focus()
  }
}

function hasPendingAnalysis(doc?: DfDocument | null): boolean {
  const isToProcess = doc?.documentStatus === 'TO_PROCESS'
  const isFinished = !!doc?.documentAnalysisReport?.analysisStatus
  return isToProcess && !isFinished
}

watch(
  () => props.isUploading,
  (uploading) => {
    if (uploading) {
      analysisInProgress.value = true
    } else if (!hasPendingAnalysis(document.value)) {
      analysisInProgress.value = false
    }
  },
  { immediate: true }
)

watch(
  () => document.value,
  async (document) => {
    analysisFailedRules.value = document?.documentAnalysisReport?.failedRules ?? []
    if (document?.id) {
      if (hasPendingAnalysis(document)) {
        analysisInProgress.value = true
      }
      const status = await updateAnalysisStatus()
      if (status === AnalysisStatus.IN_PROGRESS) {
        startPolling()
      }
    } else {
      stopPolling()
      analysisInProgress.value = false
    }

    const existingComment = document?.documentAnalysisReport?.comment || ''
    explainText.value = existingComment
    explanationSubmitted.value = !!existingComment
    showExplainForm.value = !!existingComment
  },
  { immediate: true }
)

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

async function persistExplanation(): Promise<boolean> {
  const documentId = document.value?.id
  const isFormActive = props.strategy ? true : showExplainForm.value
  if (!documentId || !isFormActive) {
    return true
  }
  const text = explainText.value.trim()
  if (!text) {
    return true
  }
  if (text.length < 10) {
    showExplainError.value = true
    return false
  }
  const savedComment = document.value?.documentAnalysisReport?.comment || ''
  if (explainText.value === savedComment) {
    showExplainError.value = false
    return true
  }
  const params = {
    documentId,
    tenantId: store.user.id,
    comment: explainText.value
  }
  AnalyticsService.document_analysis_save_comment(document.value?.documentCategory ?? 'NULL')
  try {
    await store.saveDocumentComment(params)
    explanationSubmitted.value = true
    showExplainError.value = false
    toast.success(t('explanation-saved'), undefined)
    return true
  } catch {
    toast.error(t('save-error'), undefined)
    return false
  }
}

// Chain after any in-flight save so concurrent triggers never race
function scheduleSave() {
  pendingSave = Promise.resolve(pendingSave).then(persistExplanation)
}

const debouncedSave = debounce(scheduleSave, SAVE_DEBOUNCE_MS)

function onExplainBlur() {
  debouncedSave.flush()
}

watch(explainText, () => {
  debouncedSave()
})

onBeforeUnmount(() => {
  stopPolling()
  debouncedSave.cancel()
})

function startPolling() {
  stopPolling()
  pollingInterval.value = setInterval(updateAnalysisStatus, POLLING_INTERVAL_MS)
  pollingTimeout.value = setTimeout(() => {
    AnalyticsService.document_analysis_timeout(document.value?.documentCategory ?? 'NULL')
    analysisInProgress.value = false
    stopPolling()
  }, props.pollingTimeoutMs)
}

async function updateAnalysisStatus(): Promise<AnalysisStatus | 'FAILED' | undefined> {
  const docId = document.value?.id
  if (!docId) {
    stopPolling()
    return undefined
  }
  try {
    const { data } = await AnalysisService.getDocumentAnalysisStatus(docId)
    if (data.status === AnalysisStatus.COMPLETED) {
      analysisInProgress.value = false
      const rules = data.analysisReport?.failedRules ?? []
      const hadBannersBefore = analysisFailedRules.value.length > 0
      analysisFailedRules.value = rules
      if (data.analysisReport) {
        store.updateDocumentAnalysisReport(docId, data.analysisReport)
      }
      if (!hadBannersBefore && rules.length > 0) {
        await nextTick()
        focusBanners()
      }
      stopPolling()
      return AnalysisStatus.COMPLETED
    } else if (data.status === AnalysisStatus.NO_ANALYSIS_SCHEDULED) {
      analysisInProgress.value = false
      stopPolling()
      return AnalysisStatus.NO_ANALYSIS_SCHEDULED
    } else if (data.status === AnalysisStatus.IN_PROGRESS) {
      analysisInProgress.value = true
      return AnalysisStatus.IN_PROGRESS
    }
    analysisInProgress.value = false
    stopPolling()
    return 'FAILED'
  } catch {
    analysisInProgress.value = false
    analysisFailedRules.value = []
    stopPolling()
    return 'FAILED'
  }
}

async function openExplainSection(isFromLink: boolean = true, text?: string) {
  if (isFromLink) {
    AnalyticsService.document_analysis_show_comment_from_link(
      document.value?.documentCategory ?? 'NULL'
    )
  } else {
    AnalyticsService.document_analysis_show_comment(document.value?.documentCategory ?? 'NULL')
  }
  if (text) {
    explainText.value = text
  }
  showExplainForm.value = true
  showExplainError.value = false
  await nextTick()
  explainTextarea.value?.focus()
}

async function saveExplanation(): Promise<void> {
  debouncedSave.flush()
  if ((await pendingSave) === false) {
    throw new Error('save-failed')
  }
}

const isExplainError = computed(() => {
  if (showExplainError.value) {
    return explainText.value.trim().length < 10
  }
  return false
})

const explainErrorMessage = computed(() => {
  if (explainText.value.trim().length === 0) {
    return t('explain-error')
  }
  return t('explain-error-min-length')
})

function beforeSubmit(): boolean {
  if (isBusy.value) return false
  if (analysisErrorCount.value > 0) {
    const isFormActive = props.strategy ? true : showExplainForm.value
    if (isFormActive && explainText.value.trim().length >= 10) {
      showExplainError.value = false
      return true
    }
    if (props.strategy) {
      showExplainError.value = true
      if (analysisErrorBlock.value?.focusExplain) {
        analysisErrorBlock.value.focusExplain()
      } else {
        analysisErrorBlock.value?.focus()
      }
    } else if (showExplainForm.value) {
      showExplainError.value = true
      explainTextarea.value?.focus()
    } else {
      focusBanners()
    }
    return false
  }
  return true
}
</script>

<style scoped>
.analysis-success-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f5f5fe;
  border-left: 4px solid var(--blue-france-sun-113-625, #000091);
  padding: 1.25rem;
}

.analysis-success-icon {
  flex-shrink: 0;
}

.analysis-success-title {
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1.5rem;
  color: var(--blue-france-sun-113-625, #000091);
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
  font-size: 1.25rem;
  line-height: 1.75rem;
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
</style>

<i18n lang="json">
{
  "en": {
    "errors-count": "{count} error to correct | {count} errors to correct",
    "analysis-completed": "Analysis completed",
    "or": "OR",
    "uploading": "Uploading...",
    "analyzing": "Analyzing...",
    "explain-situation": "Explain my situation",
    "explain-question": "Explain why the observed documents are correct despite the detected difference.",
    "explain-placeholder": "Enter text",
    "explain-info": "This explanation will be sent to our team only. It will not appear in your tenant file.",
    "explain-error": "Please describe your situation before continuing.",
    "explain-error-min-length": "Your explanation must contain at least 10 characters.",
    "save-error": "An error occurred while saving your explanation.",
    "explanation-saved": "Explanation saved"
  },
  "fr": {
    "errors-count": "{count} erreur à corriger | {count} erreurs à corriger",
    "analysis-completed": "Analyse terminée",
    "or": "OU",
    "uploading": "Envoi en cours...",
    "analyzing": "Analyse en cours...",
    "explain-situation": "Expliquer ma situation",
    "explain-question": "Expliquez pourquoi les documents observés sont corrects malgré la différence détectée.",
    "explain-placeholder": "Texte saisi",
    "explain-info": "Cette explication sera transmise à notre équipe uniquement. Elle n'apparaîtra pas dans votre dossier locataire.",
    "explain-error": "Veuillez décrire votre situation avant de continuer.",
    "explain-error-min-length": "Votre explication doit contenir au moins 10 caractères.",
    "save-error": "Erreur lors de l'enregistrement de votre explication.",
    "explanation-saved": "Explication enregistrée"
  }
}
</i18n>
