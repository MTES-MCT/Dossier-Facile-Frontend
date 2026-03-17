<template>
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
    @explain="openExplainSection()"
  />
  <slot name="fileUploader" />
  <div v-if="analysisFailedRules.length > 0" ref="explain-section" class="explain-section">
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
      <div class="fr-input-group" :class="{ 'fr-input-group--error': showExplainError }">
        <label for="explainText" class="fr-label">{{ t('explain-question') }}</label>
        <textarea
          id="explainText"
          ref="explainTextarea"
          v-model="explainText"
          class="fr-input"
          :class="{ 'fr-input--error': showExplainError }"
          rows="5"
          :placeholder="t('explain-placeholder')"
          aria-describedby="explainText-error explainText-info"
        />
        <p v-if="showExplainError" id="explainText-error" class="fr-error-text">
          {{ t('explain-error') }}
        </p>
      </div>
      <p id="explainText-info" class="fr-info-text">
        {{ t('explain-info') }}
      </p>
      <div class="explain-form-actions">
        <DsfrButton
          type="button"
          tertiary
          size="sm"
          :label="t('explain-save')"
          @click="saveExplanation"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AnalysisService, AnalysisStatus } from '@/services/AnalysisService'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useTenantStore } from '@/stores/tenant-store'
import { DsfrBadge, DsfrButton } from '@gouvminint/vue-dsfr'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AnalysisBanners from '../analysis/AnalysisBanners.vue'
import { useDocumentFormKey } from '../documents/documentFormState'
import { toast } from '../toast/toastUtils'

const POLLING_INTERVAL_MS = 3000
const POLLING_TIMEOUT_MS = 10000

const props = withDefaults(
  defineProps<{
    isUploading?: boolean
    pollingTimoutMs?: number
  }>(),
  {
    isUploading: false,
    pollingTimoutMs: POLLING_TIMEOUT_MS
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
const userInitiatedPolling = ref(false)
const analysisBanner = useTemplateRef('analysis-banner')
const showExplainForm = ref(false)
const showExplainError = ref(false)
const explainText = ref('')
const explainTextarea = useTemplateRef<HTMLTextAreaElement>('explainTextarea')
const explanationSubmitted = ref(false)
const isFirstDocumentLoad = ref(true)

const hasUnresolvedErrors = computed(
  () => analysisErrorCount.value > 0 && !explanationSubmitted.value
)

const analysisErrorCount = computed(() => analysisFailedRules.value?.length ?? 0)
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
  beforeSubmit
})

function focusBanners() {
  analysisBanner.value?.focus()
}

watch(
  () => document.value,
  async (document) => {
    analysisFailedRules.value = document?.documentAnalysisReport?.failedRules ?? []
    if (document?.id) {
      // First arrival on page (document loaded from store) should not auto-focus banners.
      const shouldFocusAfterPolling = !isFirstDocumentLoad.value
      isFirstDocumentLoad.value = false

      userInitiatedPolling.value = shouldFocusAfterPolling
      const status = await updateAnalysisStatus()
      if (status === AnalysisStatus.IN_PROGRESS) {
        startPolling(shouldFocusAfterPolling)
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

function startPolling(userInitiated = false) {
  stopPolling()
  userInitiatedPolling.value = userInitiated
  pollingInterval.value = setInterval(updateAnalysisStatus, POLLING_INTERVAL_MS)
  pollingTimeout.value = setTimeout(() => {
    AnalyticsService.document_analysis_timeout('tax')
    analysisInProgress.value = false
    stopPolling()
  }, props.pollingTimoutMs)
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
      analysisFailedRules.value = rules
      if (userInitiatedPolling.value && rules.length > 0) {
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

async function openExplainSection(isFromLink: boolean = true) {
  if (isFromLink) {
    AnalyticsService.document_analysis_show_comment_from_link('tax')
  } else {
    AnalyticsService.document_analysis_show_comment('tax')
  }
  showExplainForm.value = true
  showExplainError.value = false
  await nextTick()
  explainTextarea.value?.focus()
}

function saveExplanation() {
  if (!explainText.value.trim()) {
    showExplainError.value = true
    explainTextarea.value?.focus()
    return
  }
  showExplainError.value = false
  const params = {
    documentId: document.value?.id,
    tenantId: store.user.id,
    comment: explainText.value
  }
  AnalyticsService.document_analysis_save_comment('tax')
  store.commentAnalysis(params).then(() => {
    explanationSubmitted.value = true
    toast.success(t('save-success'), undefined)
  })
}

function beforeSubmit(): boolean {
  if (isBusy.value) return false
  if (hasUnresolvedErrors.value) {
    focusBanners()
    return false
  }
  return true
}
</script>

<style scoped>
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
    "or": "OR",
    "uploading": "Uploading...",
    "analyzing": "Analyzing...",
    "explain-situation": "Explain my situation",
    "explain-question": "What difficulty are you encountering to correct this error?",
    "explain-placeholder": "Enter text",
    "explain-info": "This explanation will be sent to our team only. It will not appear in your tenant file.",
    "explain-save": "Save",
    "explain-error": "Please describe your situation before saving.",
    "save-success": "Your explanation has been saved"
  },
  "fr": {
    "errors-count": "{count} erreur à corriger | {count} erreurs à corriger",
    "or": "OU",
    "uploading": "Envoi en cours...",
    "analyzing": "Analyse en cours...",
    "explain-situation": "Expliquer ma situation",
    "explain-question": "Quelle difficulté rencontrez-vous pour corriger cette erreur ?",
    "explain-placeholder": "Texte saisi",
    "explain-info": "Cette explication sera transmise à notre équipe uniquement. Elle n'apparaîtra pas dans votre dossier locataire.",
    "explain-save": "Enregistrer",
    "explain-error": "Veuillez décrire votre situation avant d'enregistrer.",
    "save-success": "Votre explication a bien été enregistrée"
  }
}
</i18n>
