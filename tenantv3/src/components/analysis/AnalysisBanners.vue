<template>
  <ol
    v-if="failedRules.length > 0"
    ref="listRef"
    role="list"
    tabindex="-1"
    :aria-label="t('errors-to-fix', { count: failedRules.length })"
    class="analysis-banners"
  >
    <li v-for="(rule, index) in failedRules" :key="index" class="analysis-banner">
      <div class="banner-content">
        <div class="banner-title">
          <VIcon name="ri:alert-fill" :scale="1.25" color="#b34000" />
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
          <button type="button" class="explain-link" @click="emit('explain')">
            {{ t('explain-link') }}
          </button>
        </p>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { VIcon } from '@gouvminint/vue-dsfr'
import dayjs from 'dayjs'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import type { DocumentRule, Name } from 'df-shared-next/src/models/DocumentRule'
import { useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  failedRules: DocumentRule[]
  document?: DfDocument
}>()

const emit = defineEmits<{
  explain: []
}>()

const { t } = useI18n()
const listRef = useTemplateRef<HTMLOListElement>('listRef')

function focus() {
  listRef.value?.focus()
}

defineExpose({ focus })

const ruleTitleMap: Record<string, string> = {
  R_DOCUMENT_IA_CLASSIFICATION: 'rules.bad-classification.title',
  R_TAX_BAD_CLASSIFICATION_DECLARATIVE: 'rules.bad-classification.title',
  R_TAX_BAD_CLASSIFICATION: 'rules.bad-classification.title',
  R_VISALE_CERTIFICATE_NAME_MATCH: 'rules.names.title',
  R_VISALE_CERTIFICATE_EXPIRATION: 'rules.expiration.title',
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
  if (rule.rule === 'R_DOCUMENT_IA_CLASSIFICATION') {
    return [t('rules.bad-classification.current-other')]
  }
  if (!data) {
    return [rule.message]
  }
  switch (data.type) {
    case 'R_TAX_CLASSIFICATION':
      return data.isDeclarativeSituation
        ? [t('rules.bad-classification.tax.current-declarative')]
        : [t('rules.bad-classification.current-other')]
    case 'R_NAMES':
      return data.extractedNames.map((n) => getRNameMessage(rule.rule, n, false))
    case 'R_TAX_YEARS':
      return data.extractedYears.map((y) =>
        t('rules.wrong-year.tax.current', { taxYear: y + 1, incomeYear: y })
      )
    case 'R_EXPIRATION':
      return [t('rules.expiration.current', { date: formatDateToFrench(data.extractedDate) })]
    default:
      return [rule.message]
  }
}

function getExpectedDocLines(rule: DocumentRule): string[] {
  const data = rule.ruleData

  if (rule.rule === 'R_DOCUMENT_IA_CLASSIFICATION') {
    return [getExpectedClassification()]
  }

  if (!data) {
    return [rule.message]
  }

  switch (data.type) {
    case 'R_TAX_CLASSIFICATION':
      return [t('rules.bad-classification.tax.expected')]
    case 'R_NAMES':
      return [getRNameMessage(rule.rule, data.expectedName, true)]
    case 'R_TAX_YEARS':
      return [
        t('rules.wrong-year.tax.expected', {
          taxYear: data.expectedYear + 1,
          incomeYear: data.expectedYear
        })
      ]
    case 'R_EXPIRATION':
      return [t('rules.expiration.expected')]
    default:
      return [rule.message]
  }
}

function getExpectedClassification(): string {
  const documentSubCategory = props.document?.documentSubCategory
  if (!documentSubCategory) {
    return t('rules.bad-classification.current-other')
  }
  switch (documentSubCategory) {
    case 'VISALE':
      return t('rules.bad-classification.visale.expected')
    default:
      return t('rules.bad-classification.current-other')
  }
}

function getRNameMessage(rule: string, nameToFormat: Name, isExpected: boolean): string {
  const variant = isExpected ? 'expected' : 'current'
  const namespace = getNameRuleNamespace(rule)
  const key = `rules.names.${namespace}.${variant}`
  return t(key, { name: formatName(nameToFormat) })
}

function getNameRuleNamespace(rule: string): 'tax' | 'visale' {
  if (rule.startsWith('R_VISALE_')) {
    return 'visale'
  }
  return 'tax'
}

function formatDateToFrench(value: string): string {
  const parsed = dayjs(value)
  if (!parsed.isValid()) {
    return value
  }
  return parsed.format('DD/MM/YYYY')
}
</script>

<style scoped>
.analysis-banners {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.analysis-banners:focus {
  outline: 2px solid var(--blue-france-sun-113-625);
  outline-offset: 4px;
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

<i18n lang="json">
{
  "en": {
    "errors-to-fix": "{count} error to fix | {count} errors to fix",
    "not-matching": "This message does not match your situation?",
    "explain-link": "Explain your situation",
    "current-document": "Current document",
    "expected-document": "Document to add",
    "rules": {
      "bad-classification": {
        "title": "Incorrect document type",
        "current-other": "Non-compliant document",
        "visale": {
          "expected": "Visale certificate"
        },
        "tax": {
          "current-declarative": "Declarative situation notice for income tax",
          "expected": "Tax notice or non-taxation notice"
        }
      },
      "names": {
        "title": "Name does not match",
        "tax": {
          "current": "Tax notice in the name of {name}",
          "expected": "Tax notice in the name of {name} or non-taxation notice"
        },
        "visale": {
          "current": "Visale certificate in the name of {name}",
          "expected": "Visale certificate in the name of {name}"
        }
      },
      "wrong-year": {
        "tax": {
          "title": "Tax notice too old",
          "current": "Tax notice {taxYear} on {incomeYear} income",
          "expected": "Tax notice {taxYear} on {incomeYear} income or non-taxation notice"
        }
      },
      "expiration": {
        "title": "Document expired",
        "current": "Document with expiration date {date}",
        "expected": "Document that is not expired"
      },
      "invalid-2ddoc": {
        "title": "Invalid document"
      }
    }
  },
  "fr": {
    "errors-to-fix": "{count} erreur à corriger | {count} erreurs à corriger",
    "not-matching": "Ce message ne correspond pas à votre situation ?",
    "explain-link": "Expliquer votre situation",
    "current-document": "Document actuel",
    "expected-document": "Document à ajouter",
    "rules": {
      "bad-classification": {
        "title": "Type de document incorrect",
        "tax": {
          "current-declarative": "Avis de situation déclarative pour l'impôt sur le revenu",
          "expected": "Avis d'imposition ou avis de non-imposition"
        },
        "visale": {
          "expected": "Certificat Visale"
        },
        "current-other": "Autre document non conforme"
      },
      "names": {
        "title": "Le nom ne correspond pas",
        "tax": {
          "current": "Avis d'imposition au nom de {name}",
          "expected": "Avis d'imposition au nom de {name} ou avis de non-imposition"
        },
        "visale": {
          "current": "Attestation Visale au nom de {name}",
          "expected": "Attestation Visale au nom de {name}"
        }
      },
      "wrong-year": {
        "tax": {
          "title": "Avis d'imposition trop ancien",
          "current": "Avis d'imposition {taxYear} sur revenus {incomeYear}",
          "expected": "Avis d'imposition {taxYear} sur revenus {incomeYear} ou avis de non-imposition"
        }
      },
      "expiration": {
        "title": "Document expiré",
        "current": "Document avec date d'expiration {date}",
        "expected": "Document non expiré"
      },
      "invalid-2ddoc": {
        "title": "Document invalide"
      }
    }
  }
}
</i18n>
