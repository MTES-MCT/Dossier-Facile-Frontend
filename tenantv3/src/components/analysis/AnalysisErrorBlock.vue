<template>
  <div
    ref="cardRef"
    tabindex="-1"
    class="analysis-error-block fr-mb-3w"
    role="alert"
  >
    <!-- Header banner with warning icon and main title -->
    <div class="analysis-error-header">
      <VIcon
        name="ri:alert-fill"
        :scale="1.2"
        color="var(--text-default-warning)"
        class="analysis-error-header-icon"
        aria-hidden="true"
      />
      <h3 class="analysis-error-header-title">
        {{ strategy.getHeaderTitle(failedRules, t) }}
      </h3>
    </div>

    <div class="analysis-error-body">
      <!-- Bullet list when bullets exist -->
      <ul v-if="bullets.length > 0" class="analysis-error-bullets">
        <li v-for="(bulletHtml, index) in bullets" :key="index">
          <span v-safe-html="bulletHtml"></span>
        </li>
      </ul>

      <!-- Expected Document Section -->
      <div class="analysis-error-section fr-mt-2w">
        <h4 class="analysis-error-section-title fr-text--bold">
          {{ t('expected-document-title') }}
        </h4>
        <p
          v-safe-html="strategy.getExpectedDocumentHtml(failedRules, t)"
          class="analysis-error-expected-text"
          @click="onExpectedTextClick"
        ></p>
      </div>

      <!-- Action section (only if strategy defines an action) -->
      <template v-if="action">
        <hr class="analysis-error-hr fr-pb-0" />
        <div class="analysis-error-section">
          <h4 class="analysis-error-section-title fr-text--bold">
            {{ action.title }}
          </h4>
          <p class="analysis-error-section-text">
            {{ action.description }}
          </p>
          <DsfrButton
            type="button"
            secondary
            class="continue-without-btn fr-mt-2w fr-mb-2w"
            :label="action.buttonLabel"
            @click="onCtaClick"
          />
          <p v-if="action.subtext" class="analysis-error-subtext">
            {{ action.subtext }}
          </p>
        </div>
      </template>

      <!-- OU separator -->
      <div class="analysis-error-separator">
        <div class="separator-line"></div>
        <span class="separator-text">{{ t('or') }}</span>
        <div class="separator-line"></div>
      </div>

      <!-- Situation explanation section -->
      <div class="analysis-error-explain">
        <div class="fr-input-group" :class="{ 'fr-input-group--error': isExplainError }">
          <label for="explainText" class="fr-label explain-label">
            {{ t('explain-question') }}
          </label>
          <textarea
            id="explainText"
            ref="explainTextarea"
            v-model="explainTextModel"
            class="fr-input fr-mt-1w"
            :class="{ 'fr-input--error': isExplainError }"
            rows="3"
            :placeholder="t('explain-placeholder')"
            :aria-invalid="isExplainError"
            :aria-describedby="isExplainError ? 'explainText-error explain-info-text' : 'explain-info-text'"
          />
          <p v-if="isExplainError" id="explainText-error" class="fr-error-text">
            {{ explainErrorMessage }}
          </p>
        </div>
        <div class="explain-info-box fr-mt-2w">
          <VIcon
            name="ri:information-fill"
            color="var(--text-default-info)"
            class="explain-info-icon"
            aria-hidden="true"
          />
          <span id="explain-info-text" class="explain-info-text fr-mb-2w">
            {{ t('explain-info') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import { DsfrButton, VIcon } from '@gouvminint/vue-dsfr'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BaseAnalysisErrorStrategy } from './strategies/BaseAnalysisErrorStrategy'

const props = defineProps<{
  failedRules: DocumentRule[]
  strategy: BaseAnalysisErrorStrategy
  hasExplainError?: boolean
}>()

const explainTextModel = defineModel<string>({ default: '' })

const emit = defineEmits<{
  customEvent: [eventName: string]
}>()

const { t } = useI18n()

const bullets = computed(() =>
  props.strategy.getBulletList?.(props.failedRules, t) ??
  (props.failedRules.length > 1 ? props.failedRules.map((rule) => props.strategy.getBulletText(rule, t)) : [])
)
const action = computed(() => props.strategy.getAction(props.failedRules, t))

const cardRef = useTemplateRef<HTMLElement>('cardRef')
const explainTextarea = useTemplateRef<HTMLTextAreaElement>('explainTextarea')


// We detect if inside the block there is a <a> element and trigger the strategy onLinkClick method
function onExpectedTextClick(event: MouseEvent) {
  const anchor = (event.target as HTMLElement | null)?.closest('a')
  if (anchor && props.strategy.onLinkClick) {
    props.strategy.onLinkClick(anchor.href)
  }
}

function onCtaClick() {
  if (props.strategy.subCategory) {
    AnalyticsService.document_ia_error_cta_click(props.strategy.subCategory)
  }
  if (action.value) {
    emit('customEvent', action.value.customEventName)
  }
}

const isExplainError = computed(() => {
  if (props.hasExplainError) {
    return explainTextModel.value.trim().length < 10
  }
  return false
})

const explainErrorMessage = computed(() => {
  if (explainTextModel.value.trim().length === 0) {
    return t('explain-error')
  }
  return t('explain-error-min-length')
})

function focus() {
  cardRef.value?.focus()
}

function focusExplain() {
  explainTextarea.value?.focus()
}

defineExpose({
  focus,
  focusExplain
})
</script>

<style scoped>
.analysis-error-block {
  border: 1px solid var(--border-plain-warning);
  background-color: var(--background-default-grey, #ffffff);
  overflow: hidden;
}

.analysis-error-block:focus {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}

.analysis-error-header {
  background-color: var(--background-contrast-warning);
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.analysis-error-header-icon {
  flex-shrink: 0;
}

.analysis-error-header-title {
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: 700;
  color: var(--text-default-warning);
}

.analysis-error-body {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  padding-top: 1rem;
}

.analysis-error-bullets {
  margin: 0 0 1rem 1.25rem;
  padding: 0;
  color: var(--text-default-warning);
  font-size: 1rem;
  line-height: 1.5rem;
  list-style-type: disc;
}

.analysis-error-bullets li {
  margin-bottom: 0.25rem;
}

.analysis-error-bullets :deep(strong) {
  font-weight: 700;
}

.analysis-error-section-title {
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 700;
  color: var(--text-title-grey);
  margin: 0 0 0.5rem 0;
}

.analysis-error-section-text {
  font-size: 1rem;
  line-height: 1.5rem;
  color: var(--text-default-grey);
  margin: 0;
}

.analysis-error-section-text :deep(strong) {
  font-weight: 700;
}

.analysis-error-expected-text {
  font-size: 1rem;
  line-height: 1.5rem;
  color: var(--text-action-high-blue-france);
  margin: 0;
}

.analysis-error-expected-text :deep(strong) {
  font-weight: 700;
  color: var(--text-action-high-blue-france);
}

.analysis-error-expected-text :deep(a) {
  color: var(--text-action-high-blue-france);
  text-decoration: underline;
  background-image: none;
  border-bottom: none;
  box-shadow: none;
  font-weight: 700;
}

.analysis-error-subtext {
  font-size: 0.9375rem;
  line-height: 1.375rem;
  color: var(--text-mention-grey);
  margin: 0;
}

.analysis-error-hr {
  border: none;
  border-top: 1px solid var(--border-default-grey);
  margin: 1rem 0;
}

.analysis-error-separator {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.separator-line {
  flex: 1;
  height: 1px;
  background-color: var(--border-default-grey);
}

.separator-text {
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--text-title-grey);
}

.explain-label {
  font-size: 1rem;
  line-height: 1.5rem;
  color: var(--text-title-grey);
}

.explain-info-box {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: var(--text-default-info);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.explain-info-icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}
</style>

<i18n lang="json">
{
  "en": {
    "expected-document-title": "Expected document",
    "or": "OR",
    "explain-question": "Does this document look correct to you? Add an explanation of your situation:",
    "explain-placeholder": "Text entered",
    "explain-info": "This explanation will be transmitted to our team only. It will not appear in your tenant file.",
    "explain-error": "Please describe your situation before continuing.",
    "explain-error-min-length": "Your explanation must contain at least 10 characters.",
    "visale-errors": {
      "multiple-header": "Errors detected on document",
      "bad-classification-header": "This is not the expected certificate",
      "expiration-header": "This document expired on {date}",
      "name-header": "Name error detected on document",
      "default-header": "Error on document",
      "expiration-bullet": "Expired since <strong>{date}</strong>",
      "name-bullet": "Certificate in the name of <strong>{name}</strong> different from yours",
      "bad-classification-bullet": "Incorrect document type",
      "expected-classification": "Add your Visale guarantee certificate, see an example in <a href=\"https://aide.dossierfacile.logement.gouv.fr/fr/article/organisme-garant-1ne3cvn/\" target=\"_blank\" rel=\"noopener noreferrer\">our online help</a>",
      "expected-name-and-expiration": "Add your Visale guarantee certificate in the name of <strong>{name}</strong> and <strong>currently valid</strong>",
      "expected-name": "Add your Visale guarantee certificate in the name of <strong>{name}</strong>",
      "expected-expiration": "Add your Visale guarantee certificate <strong>currently valid</strong>",
      "expected-default": "Add your Visale guarantee certificate",
      "action-title": "Waiting for your new certificate?",
      "action-description": "You can continue your application without a Visale guarantor and add it as soon as it is issued.",
      "action-button": "Continue without guarantor for now",
      "action-subtext": "You will be able to inform at the end of the process that your Visale is being renewed."
    },
    "professional-errors": {
      "multiple-header": "Errors detected on document",
      "issue-date-header": "This document was issued on {date}",
      "name-header": "Name error detected on document",
      "default-header": "Error on document",
      "issue-date-bullet": "Issued on <strong>{date}</strong> (must be less than 2 months old)",
      "name-bullet": "Certificate in the name of <strong>{name}</strong> different from yours",
      "expected-name-and-issue-date": "Add a proof of professional activity in the name of <strong>{name}</strong> and <strong>less than 2 months old</strong>",
      "expected-name": "Add a proof of professional activity in the name of <strong>{name}</strong>",
      "expected-issue-date": "Add a proof of professional activity <strong>less than 2 months old</strong>",
      "expected-default": "Add a proof of professional activity"
    }
  },
  "fr": {
    "expected-document-title": "Document attendu",
    "or": "OU",
    "explain-question": "Ce document vous paraît correct ? Ajouter une explication sur votre situation :",
    "explain-placeholder": "Texte saisi",
    "explain-info": "Cette explication sera transmise à notre équipe uniquement. Elle n'apparaîtra pas dans votre dossier locataire.",
    "explain-error": "Veuillez décrire votre situation avant de continuer.",
    "explain-error-min-length": "Votre explication doit contenir au moins 10 caractères.",
    "visale-errors": {
      "multiple-header": "Des erreurs sont détectées sur le document",
      "bad-classification-header": "Ce n’est pas le certificat attendu",
      "expiration-header": "Ce document est expiré depuis le {date}",
      "name-header": "Une erreur de nom détectée sur le document",
      "default-header": "Erreur sur le document",
      "expiration-bullet": "Expiré depuis le <strong>{date}</strong>",
      "name-bullet": "Attestation au nom de <strong>{name}</strong> différent du vôtre",
      "bad-classification-bullet": "Type de document incorrect",
      "expected-classification": "Ajoutez votre certificat de garantie Visale, voir un exemple dans <a href=\"https://aide.dossierfacile.logement.gouv.fr/fr/article/organisme-garant-1ne3cvn/\" target=\"_blank\" rel=\"noopener noreferrer\">notre aide en ligne</a>",
      "expected-name-and-expiration": "Ajoutez votre certificat de garantie Visale au nom de <strong>{name}</strong> et <strong>en cours de validité</strong>",
      "expected-name": "Ajoutez votre certificat de garantie Visale au nom de <strong>{name}</strong>",
      "expected-expiration": "Ajoutez votre certificat de garantie Visale <strong>en cours de validité</strong>",
      "expected-default": "Ajoutez votre certificat de garantie Visale",
      "action-title": "En attente de votre nouvelle attestation ?",
      "action-description": "Vous pouvez continuer votre dossier sans garant Visale et l’ajouter dès qu’elle sera délivrée.",
      "action-button": "Continuer sans garant pour l’instant",
      "action-subtext": "Vous pourrez informer à la fin du parcours que votre Visale est en cours de renouvellement."
    },
    "professional-errors": {
      "multiple-header": "Des erreurs sont détectées sur le document",
      "issue-date-header": "Ce document a été émis le {date}",
      "name-header": "Une erreur de nom détectée sur le document",
      "default-header": "Erreur sur le document",
      "issue-date-bullet": "Émis le <strong>{date}</strong> (doit dater de moins de 2 mois)",
      "name-bullet": "Attestation au nom de <strong>{name}</strong> différent du vôtre",
      "expected-name-and-issue-date": "Ajoutez un justificatif d’activité professionnelle au nom de <strong>{name}</strong> et <strong>de moins de 2 mois</strong>",
      "expected-name": "Ajoutez un justificatif d’activité professionnelle au nom de <strong>{name}</strong>",
      "expected-issue-date": "Ajoutez un justificatif d’activité professionnelle <strong>de moins de 2 mois</strong>",
      "expected-default": "Ajoutez un justificatif d’activité professionnelle"
    }
  }
}
</i18n>
