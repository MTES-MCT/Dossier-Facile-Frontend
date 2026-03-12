<template>
  <div v-if="analysisErrorCount > 0" class="error-badge fr-mb-2w">
    <VIcon name="ri:alert-fill" class="badge-icon" aria-hidden="true" color="#b34000" />
    <span class="badge-text">{{
      t('errors-count', { count: analysisErrorCount }, analysisErrorCount)
    }}</span>
  </div>
  <slot name="fileSpecificDescription" />
  <AnalysisBanners
    v-if="analysisErrorCount > 0"
    ref="analysis-banner"
    :failed-rules="analysisFailedRules ?? []"
    class="fr-mb-3w"
    @explain="openExplainSection()"
  />
  <!-- -- "> -->
  <slot name="fileUploader" />
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
    <button
      type="button"
      class="fr-btn fr-btn--secondary explain-btn"
      @click="openExplainSection(false)"
    >
      {{ t('explain-situation') }}
    </button>
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
          aria-describedby="explainText-error"
        />
        <p
          v-if="showExplainError"
          id="explainText-error"
          aria-live="assertive"
          class="fr-error-text"
        >
          {{ t('explain-error') }}
        </p>
      </div>
      <p class="fr-info-text">
        {{ t('explain-info') }}
      </p>
      <div class="explain-form-actions">
        <button type="button" class="fr-btn fr-btn--tertiary fr-btn--sm" @click="saveExplanation">
          {{ t('explain-save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AnalysisService, AnalysisStatus } from '@/services/AnalysisService'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useTenantStore } from '@/stores/tenant-store'
import { VIcon } from '@gouvminint/vue-dsfr'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AnalysisBanners from '../analysis/AnalysisBanners.vue'
import { toast } from '../toast/toastUtils'

const POLLING_INTERVAL_MS = 3000
const POLLING_TIMEOUT_MS = 10000

const props = defineProps<{
  document: DfDocument | undefined
}>()

const { t } = useI18n()

const analysisFailedRules = ref<DocumentRule[]>(
  props.document?.documentAnalysisReport?.failedRules ?? []
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

const analysisErrorCount = computed(() => analysisFailedRules.value?.length ?? 0)

const store = useTenantStore()

defineExpose({ focusBanners, analysisInProgress, analysisFailedRules, explanationSubmitted })

function focusBanners() {
  analysisBanner.value?.focus()
}

watch(
  () => props.document,
  async (document) => {
    analysisFailedRules.value = document?.documentAnalysisReport?.failedRules ?? []
    if (!document?.id) {
      stopPolling()
      analysisInProgress.value = false
    } else {
      // First arrival on page (document loaded from store) should not auto-focus banners.
      const shouldFocusAfterPolling = !isFirstDocumentLoad.value
      isFirstDocumentLoad.value = false

      userInitiatedPolling.value = shouldFocusAfterPolling
      const status = await updateAnalysisStatus()
      if (status === AnalysisStatus.IN_PROGRESS) {
        startPolling(shouldFocusAfterPolling)
      }
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
  }, POLLING_TIMEOUT_MS)
}

async function updateAnalysisStatus(): Promise<AnalysisStatus | 'FAILED' | undefined> {
  const docId = props.document?.id
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
    documentId: props.document?.id,
    tenantId: store.user.id,
    comment: explainText.value
  }
  AnalyticsService.document_analysis_save_comment('tax')
  store.commentAnalysis(params).then(() => {
    explanationSubmitted.value = true
    toast.success(t('save-success'), undefined)
  })
}
</script>

<style scoped>
.error-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #ffe9e6;
  border-radius: 4px;
  padding: 0 0.5rem;
  width: fit-content;
}

.badge-icon {
  width: 1rem;
  height: 1rem;
}

.badge-text {
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #b34000;
  text-transform: uppercase;
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
</style>

<i18n lang="json">
{
  "en": {
    "errors-count": "{count} error to correct | {count} errors to correct",
    "or": "OR",
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
