<template>
  <GenericAnalysisErrorContent
    :title="getTitle()"
    :current-lines="getCurrentLines()"
    :expected-lines="getExpectedLines()"
    :current-document-label="currentDocumentLabel ?? t('current-document')"
    :expected-document-label="expectedDocumentLabel ?? t('expected-document')"
    :not-matching-label="notMatchingLabel"
    :explain-link-label="explainLinkLabel"
    @explain="(text) => emit('explain', text)"
  >
    <template v-if="isClassificationError" #default>
      <p class="confirm-prompt-text">
        {{ t('confirm-prompt') }}
      </p>
      <DsfrButton
        type="button"
        secondary
        class="confirm-tax-btn"
        :label="t('confirm-button')"
        @click="onConfirmTaxNotice"
      />
      <div class="separator fr-my-2w">
        <div class="separator-line"></div>
        <span class="separator-text">{{ t('or') }}</span>
        <div class="separator-line"></div>
      </div>
      <p class="explain-link-text">
        {{ t('need-explain') }}
        <button type="button" class="explain-link" @click="emit('explain')">
          {{ explainLinkLabel }}
        </button>
      </p>
    </template>
  </GenericAnalysisErrorContent>
</template>

<script setup lang="ts">
import GenericAnalysisErrorContent from '@/components/analysis/GenericAnalysisErrorContent.vue'
import { DsfrButton } from '@gouvminint/vue-dsfr'
import type { DocumentRule, Name } from 'df-shared-next/src/models/DocumentRule'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { taxYear, getTaxYearPeriod } from '../taxYear'

const props = defineProps<{
  rule: DocumentRule
  index?: number
  currentDocumentLabel?: string
  expectedDocumentLabel?: string
  notMatchingLabel: string
  explainLinkLabel: string
}>()

const emit = defineEmits<{
  explain: [explanationText?: string]
}>()

const { t } = useI18n()

function formatName(name: Name): string {
  return `${name.lastName} ${name.firstNames}`.trim()
}

const isDeclarative = computed(() => {
  return (
    props.rule.ruleData?.type === 'R_TAX_CLASSIFICATION' &&
    props.rule.ruleData.isDeclarativeSituation
  )
})

const isClassificationError = computed(() => {
  const r = props.rule.rule
  return (
    (r === 'R_TAX_BAD_CLASSIFICATION' ||
      r === 'R_TAX_BAD_CLASSIFICATION_DECLARATIVE' ||
      r === 'R_DOCUMENT_IA_CLASSIFICATION') &&
    !isDeclarative.value
  )
})

function getTitle(): string {
  const r = props.rule.rule
  if (
    r === 'R_TAX_BAD_CLASSIFICATION' ||
    r === 'R_TAX_BAD_CLASSIFICATION_DECLARATIVE' ||
    r === 'R_DOCUMENT_IA_CLASSIFICATION'
  ) {
    return t('bad-classification.title')
  }
  if (r === 'R_TAX_LEAF') {
    return t('wrong-number-of-documents.title')
  }
  if (r === 'R_TAX_NAMES') {
    return t('names.title')
  }
  if (r === 'R_TAX_WRONG_YEAR') {
    return t('tax-wrong-year.title')
  }
  if (r === 'R_TAX_2D_DOC') {
    return t('invalid-2ddoc.title')
  }
  return props.rule.message
}

function getCurrentLines(): string[] {
  const r = props.rule.rule
  const data = props.rule.ruleData

  if (r === 'R_TAX_LEAF') {
    return [t('wrong-number-of-documents.current')]
  }

  if (r === 'R_DOCUMENT_IA_CLASSIFICATION' || r === 'R_TAX_BAD_CLASSIFICATION') {
    return [t('bad-classification.current-other')]
  }

  if (!data) {
    return [props.rule.message]
  }

  switch (data.type) {
    case 'R_TAX_CLASSIFICATION':
      return data.isDeclarativeSituation
        ? [t('bad-classification.current-declarative')]
        : [t('bad-classification.current-other')]
    case 'R_TAX_NAMES':
      return data.extractedIdentities.map((n) => t('names.current', { name: n }))
    case 'R_TAX_YEARS':
      return data.extractedYears.map((y) =>
        t('tax-wrong-year.current', { taxYear: y + 1, incomeYear: y })
      )
    case 'R_NAMES':
      return data.extractedNames.map((n) => t('names.current', { name: formatName(n) }))
    default:
      return [props.rule.message]
  }
}

function getExpectedLines(): string[] {
  const r = props.rule.rule
  const data = props.rule.ruleData

  if (
    r === 'R_DOCUMENT_IA_CLASSIFICATION' ||
    r === 'R_TAX_BAD_CLASSIFICATION' ||
    r === 'R_TAX_BAD_CLASSIFICATION_DECLARATIVE'
  ) {
    return [t('bad-classification.expected')]
  }

  if (r === 'R_TAX_LEAF') {
    return [t('wrong-number-of-documents.expected', { year: taxYear })]
  }

  if (!data) {
    return [props.rule.message]
  }

  switch (data.type) {
    case 'R_TAX_CLASSIFICATION':
      return [t('bad-classification.expected')]
    case 'R_TAX_NAMES':
      return [t('names.expected', { name: data.expectedName.lastName })]
    case 'R_NAMES':
      return [t('names.expected', { name: formatName(data.expectedName) })]
    case 'R_TAX_YEARS':
      return [
        t('tax-wrong-year.expected', {
          taxYear: data.expectedYear + 1,
          incomeYear: data.expectedYear
        })
      ]
    default:
      return [props.rule.message]
  }
}

function onConfirmTaxNotice() {
  const periodInfo = getTaxYearPeriod()
  const isBeforeJuly = periodInfo.period === 'BEFORE_JULY'
  const confirmTaxYear = isBeforeJuly ? periodInfo.taxYear : periodInfo.nextTaxYear
  const confirmIncomeYear = isBeforeJuly ? periodInfo.incomeYear : periodInfo.nextIncomeYear

  const explanationText = t('confirm-explanation', {
    taxYear: confirmTaxYear,
    incomeYear: confirmIncomeYear
  })
  emit('explain', explanationText)
}
</script>

<style scoped>
@import '@/components/analysis/analysisBannerLayout.css';

.confirm-prompt-text {
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #161616;
  margin: 0.75rem 0 0.5rem 0;
}

.confirm-tax-btn {
  width: 100%;
  justify-content: center;
  background-color: transparent;
  color: var(--text-action-high-blue-france);
  border: 1px solid var(--border-action-high-blue-france);
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--text-mention-grey);
}

.separator-line {
  flex: 1;
  border-bottom: 1px solid #cecece;
}

.separator-text {
  padding: 0 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #666666;
}

.explain-link-text {
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #161616;
  margin: 0;
}

.explain-link {
  color: #161616;
  text-decoration: underline;
  font-weight: 400;
  font-family: inherit;
  font-size: inherit;
  background: none;
  background-image: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline;
}
</style>

<i18n lang="json">
{
  "en": {
    "current-document": "Current document",
    "expected-document": "Document to add",
    "or": "OR",
    "confirm-prompt": "If this is the right document, please confirm below.",
    "confirm-button": "I confirm this is my tax notice",
    "confirm-explanation": "I provided a {taxYear} tax notice on {incomeYear} income",
    "need-explain": "Need to clarify your situation?",
    "bad-classification": {
      "title": "Unrecognized document",
      "current-declarative": "Declarative situation notice for income tax",
      "current-other": "Unrecognized document",
      "expected": "Complete tax notice"
    },
    "wrong-number-of-documents": {
      "title": "Incomplete document",
      "expected": "Complete {year} tax notice (all pages)",
      "current": "Incomplete tax notice (missing pages)"
    },
    "names": {
      "title": "Name does not match",
      "current": "Tax notice in the name of {name}",
      "expected": "Tax notice in the name of {name}"
    },
    "tax-wrong-year": {
      "title": "Tax notice too old",
      "current": "Tax notice {taxYear} on {incomeYear} income",
      "expected": "Tax notice {taxYear} on {incomeYear} income"
    },
    "invalid-2ddoc": {
      "title": "Invalid document"
    }
  },
  "fr": {
    "current-document": "Document actuel",
    "expected-document": "Document à ajouter",
    "or": "OU",
    "confirm-prompt": "Si c'est le bon document, confirmez-le ci-dessous.",
    "confirm-button": "Je confirme que c'est mon avis d'imposition",
    "confirm-explanation": "J'ai fourni un avis d'imposition {taxYear} sur les revenus {incomeYear}",
    "need-explain": "Besoin de préciser votre situation ?",
    "bad-classification": {
      "title": "Document non reconnu",
      "current-declarative": "Avis de situation déclarative pour l'impôt sur le revenu",
      "current-other": "Document non reconnu",
      "expected": "Avis d'imposition complet"
    },
    "wrong-number-of-documents": {
      "title": "Document incomplet",
      "expected": "Avis d'imposition {year} complet (toutes les pages)",
      "current": "Avis d'imposition incomplet (pages manquantes)"
    },
    "names": {
      "title": "Le nom ne correspond pas",
      "current": "Avis d'imposition au nom de {name}",
      "expected": "Avis d'imposition au nom de {name}"
    },
    "tax-wrong-year": {
      "title": "Avis d'imposition trop ancien",
      "current": "Avis d'imposition {taxYear} sur revenus {incomeYear}",
      "expected": "Avis d'imposition {taxYear} sur revenus {incomeYear}"
    },
    "invalid-2ddoc": {
      "title": "Document invalide"
    }
  }
}
</i18n>
