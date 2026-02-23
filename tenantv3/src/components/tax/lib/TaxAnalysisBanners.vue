<template>
  <div v-if="failedRules.length > 0" class="analysis-banners">
    <div v-for="(rule, index) in failedRules" :key="index" class="analysis-banner">
      <div class="banner-content">
        <div class="banner-title">
          <VIcon name="ri:alert-fill" :scale="1.25" color="#b34000"/>
          <span class="title-text">{{ getRuleTitle(rule.rule) }}</span>
        </div>
        <div class="banner-description">
          <div class="current-doc">
            <p class="doc-label">{{ t('current-document') }}</p>
            <div
              v-for="(line, i) in getCurrentDocLines(rule)"
              :key="'extracted-' + i"
              class="doc-line"
            >
              <VIcon name="ri:close-line" :scale="1.25" color="#b34000" />
              <span class="error-text">{{ line }}</span>
            </div>
          </div>
          <div class="expected-doc">
            <p class="doc-label">{{ t('expected-document') }}</p>
            <div
              v-for="(line, i) in getExpectedDocLines(rule)"
              :key="'expected-' + i"
              class="doc-line"
            >
              <VIcon name="ri:check-line" :scale="1.25" color="#18753c" />
              <span class="success-text">{{ line }}</span>
            </div>
          </div>
        </div>
        <p class="explain-link-text">
          {{ t('not-matching') }}
          <button type="button" class="explain-link" @click="emit('explain')">{{ t('explain-link') }}</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { DocumentRule, Name } from 'df-shared-next/src/models/DocumentRule'
import { VIcon } from '@gouvminint/vue-dsfr'

defineProps<{
  failedRules: DocumentRule[]
}>()

const emit = defineEmits<{
  explain: []
}>()

const { t } = useI18n()

const ruleTitleMap: Record<string, string> = {
  R_TAX_BAD_CLASSIFICATION_DECLARATIVE: 'rules.bad-classification.title',
  R_TAX_BAD_CLASSIFICATION: 'rules.bad-classification.title',
  R_TAX_NAMES: 'rules.names.title',
  R_TAX_WRONG_YEAR: 'rules.wrong-year.title',
  R_TAX_2D_DOC: 'rules.invalid-2ddoc.title'
}

function getRuleTitle(rule: string): string {
  const key = ruleTitleMap[rule]
  return key ? t(key) : rule
}

function formatName(name: Name): string {
  return `${name.firstNames} ${name.lastName}`.trim()
}

function getCurrentDocLines(rule: DocumentRule): string[] {
  const data = rule.ruleData
  if (!data) {
    return [rule.message]
  }
  switch (data.type) {
    case 'R_TAX_CLASSIFICATION':
      return data.isDeclarativeSituation
        ? [t('rules.bad-classification.current-declarative')]
        : [t('rules.bad-classification.current-other')]
    case 'R_NAMES':
      return data.extractedNames.map((n) => t('rules.names.current', { name: formatName(n) }))
    case 'R_TAX_YEARS':
      return data.extractedYears.map((y) =>
        t('rules.wrong-year.current', { taxYear: y + 1, incomeYear: y })
      )
    default:
      return [rule.message]
  }
}

function getExpectedDocLines(rule: DocumentRule): string[] {
  const data = rule.ruleData
  if (!data) {
    return [rule.message]
  }
  switch (data.type) {
    case 'R_TAX_CLASSIFICATION':
      return [t('rules.bad-classification.expected')]
    case 'R_NAMES':
      return [t('rules.names.expected', { name: formatName(data.expectedName) })]
    case 'R_TAX_YEARS':
      return [
        t('rules.wrong-year.expected', {
          taxYear: data.expectedYear + 1,
          incomeYear: data.expectedYear
        })
      ]
    default:
      return [rule.message]
  }
}
</script>

<style scoped>
.analysis-banners {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.analysis-banner {
  background-color: #ffe9e6;
  padding: 1rem;
}

.banner-content {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.banner-title {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.title-text {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #b34000;
}

.banner-description {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.doc-label {
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #161616;
  margin: 0;
}

.current-doc,
.expected-doc {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.doc-line {
  display: flex;
  align-items: flex-start;
}

.error-text {
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #b34000;
}

.success-text {
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #18753c;
}

.explain-link-text {
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #161616;
  margin: 0.75rem 0 0;
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
}
</style>

<i18n>
{
  "en": {
    "not-matching": "This message does not match your situation?",
    "explain-link": "Explain your situation",
    "current-document": "Current document",
    "expected-document": "Document to add",
    "rules": {
      "bad-classification": {
        "title": "Incorrect document type",
        "current-declarative": "Declarative situation notice for income tax",
        "current-other": "Non-compliant document",
        "expected": "Tax notice or non-taxation notice"
      },
      "names": {
        "title": "Name does not match",
        "current": "Tax notice in the name of {name}",
        "expected": "Tax notice in the name of {name} or non-taxation notice"
      },
      "wrong-year": {
        "title": "Tax notice too old",
        "current": "Tax notice {taxYear} on {incomeYear} income",
        "expected": "Tax notice {taxYear} on {incomeYear} income or non-taxation notice"
      },
      "invalid-2ddoc": {
        "title": "Invalid document"
      }
    }
  },
  "fr": {
    "not-matching": "Ce message ne correspond pas à votre situation ?",
    "explain-link": "Expliquer votre situation",
    "current-document": "Document actuel",
    "expected-document": "Document à ajouter",
    "rules": {
      "bad-classification": {
        "title": "Type de document incorrect",
        "current-declarative": "Avis de situation déclarative à l'impôt sur le revenu",
        "current-other": "Autre document non conforme",
        "expected": "Avis d'imposition ou avis de non-imposition"
      },
      "names": {
        "title": "Le nom ne correspond pas",
        "current": "Avis d'imposition au nom de {name}",
        "expected": "Avis d'imposition au nom de {name} ou avis de non-imposition"
      },
      "wrong-year": {
        "title": "Avis d'imposition trop ancien",
        "current": "Avis d'imposition {taxYear} sur revenus {incomeYear}",
        "expected": "Avis d'imposition {taxYear} sur revenus {incomeYear} ou avis de non-imposition"
      },
      "invalid-2ddoc": {
        "title": "Document invalide"
      }
    }
  }
}
</i18n>
