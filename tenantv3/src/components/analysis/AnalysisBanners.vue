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
      <!-- Fallback content if no custom slot is provided by parent -->
      <!-- Look  UploadFileFinancialWithAnalysis for custom use -->
      <slot
        name="errorContent"
        v-bind="{
          rule,
          index,
          notMatchingLabel: t('not-matching'),
          explainLinkLabel: t('explain-link'),
          onExplain: () => emit('explain')
        }"
      >
        <GenericAnalysisErrorContent
          :title="getRuleTitle(rule.rule)"
          :current-lines="getCurrentDocLines(rule)"
          :expected-lines="getExpectedDocLines(rule)"
          :current-document-label="t('current-document')"
          :expected-document-label="t('expected-document')"
          :not-matching-label="t('not-matching')"
          :explain-link-label="t('explain-link')"
          @explain="emit('explain')"
        />
      </slot>
    </li>
  </ol>
</template>

<script setup lang="ts">
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import type { DocumentRule, Name } from 'df-shared-next/src/models/DocumentRule'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/fr'
import { useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { taxYear } from '../tax/lib/taxYear'
import GenericAnalysisErrorContent from './GenericAnalysisErrorContent.vue'

dayjs.extend(customParseFormat)

const props = defineProps<{
  failedRules: DocumentRule[]
  document?: DfDocument
}>()

const emit = defineEmits<{
  explain: []
}>()

const { t, locale } = useI18n()
const listRef = useTemplateRef<HTMLOListElement>('listRef')

function focus() {
  listRef.value?.focus()
}

defineExpose({ focus })

const ruleTitleMap: Record<string, string> = {
  R_DOCUMENT_IA_CLASSIFICATION: 'rules.bad-classification.title',
  R_TAX_BAD_CLASSIFICATION_DECLARATIVE: 'rules.bad-classification.title',
  R_TAX_BAD_CLASSIFICATION: 'rules.bad-classification.title',
  R_TAX_LEAF: 'rules.wrong-number-of-documents.title',
  R_TAX_NAMES: 'rules.names.title',
  R_TAX_WRONG_YEAR: 'rules.tax-wrong-year.title',
  R_TAX_2D_DOC: 'rules.invalid-2ddoc.title',
  R_VISALE_CERTIFICATE_NAME_MATCH: 'rules.names.title',
  R_VISALE_CERTIFICATE_EXPIRATION: 'rules.expiration.title',
  R_PAYSLIP_NAME_MATCH: 'rules.names.title',
  R_PAYSLIP_CONTINUITY: 'rules.payslip-continuity.title',
  R_PAYSLIP_CLASSIFICATION: 'rules.bad-classification.title'
}

function getRuleTitle(rule: string): string {
  const key = ruleTitleMap[rule]
  return key ? t(key) : rule
}

function formatName(name: Name): string {
  return `${name.lastName} ${name.firstNames}`.trim()
}

// There is 3 parts in the banner:
// - The title of the rule: label built with getRuleTitle
// - The "current document", with title "current-document" and lines built with getCurrentDocLines
// - The "expected document", with title "expected-document" and lines built with getExpectedDocLines
// This method is used to build the "current document" part of the banner.
function getCurrentDocLines(rule: DocumentRule): string[] {
  const data = rule.ruleData
  if (rule.rule === 'R_DOCUMENT_IA_CLASSIFICATION') {
    return [t('rules.bad-classification.current-other')]
  }

  if (rule.rule === 'R_TAX_LEAF') {
    return [t('rules.wrong-number-of-documents.current')]
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
    case 'R_TAX_NAMES':
      return data.extractedIdentities.map((n) => t('rules.names.tax.current', { name: n }))
    case 'R_TAX_YEARS':
      return data.extractedYears.map((y) =>
        t('rules.tax-wrong-year.current', { taxYear: y + 1, incomeYear: y })
      )
    case 'R_EXPIRATION':
      return [t('rules.expiration.current', { date: formatDate(data.extractedDate) })]
    default:
      return [rule.message]
  }
}

// This method is used to build the "expected document" part of the banner.
function getExpectedDocLines(rule: DocumentRule): string[] {
  const data = rule.ruleData

  if (rule.rule === 'R_DOCUMENT_IA_CLASSIFICATION') {
    return [getExpectedClassification()]
  }

  if (rule.rule === 'R_TAX_LEAF') {
    return [t('rules.wrong-number-of-documents.expected', { year: taxYear })]
  }

  if (!data) {
    return [rule.message]
  }

  switch (data.type) {
    case 'R_TAX_CLASSIFICATION':
      return [t('rules.bad-classification.tax.expected')]
    case 'R_NAMES':
    case 'R_TAX_NAMES':
    case 'R_PAYSLIP_NAMES':
      return [getRNameMessage(rule.rule, data.expectedName, true)]
    case 'R_TAX_YEARS':
      return [
        t('rules.tax-wrong-year.expected', {
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
  if (documentSubCategory === 'VISALE') {
    return t('rules.bad-classification.visale.expected')
  }
  return t('rules.bad-classification.current-other')
}

// Build the localized name message by selecting the rule namespace (tax/visale/payslip)
// and the variant (current vs expected), then resolving the corresponding i18n key.
function getRNameMessage(rule: string, nameToFormat: Name, isExpected: boolean): string {
  const variant = isExpected ? 'expected' : 'current'
  const namespace = getNameRuleNamespace(rule)
  const key = `rules.names.${namespace}.${variant}`
  return t(key, { name: formatName(nameToFormat) })
}

function getNameRuleNamespace(rule: string): 'tax' | 'visale' | 'payslip' {
  if (rule.startsWith('R_VISALE_')) {
    return 'visale'
  }
  if (rule.startsWith('R_PAYSLIP_')) {
    return 'payslip'
  }
  return 'tax'
}

function formatDate(value: string): string {
  const normalizedValue = value.trim()
  // Strict parsing rejects semantically invalid dates like 2024-13-45
  const parsed = dayjs(normalizedValue, 'YYYY-MM-DD', true)
  if (!parsed.isValid()) {
    return value
  }
  const dateFormat = locale.value === 'fr' ? 'DD/MM/YYYY' : 'MM/DD/YYYY'
  return parsed.locale(locale.value).format(dateFormat)
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
      "wrong-number-of-documents": {
        "title": "Incomplet document",
        "expected": "Complete {year} tax notice (all pages) or complete non-taxation notice",
        "current": "Incomplete tax notice (missing pages)"
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
      "tax-wrong-year": {
        "title": "Tax notice too old",
        "current": "Tax notice {taxYear} on {incomeYear} income",
        "expected": "Tax notice {taxYear} on {incomeYear} income or non-taxation notice"
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
      "wrong-number-of-documents": {
        "title": "Document incomplet",
        "expected": "Avis d'imposition {year} complet (toutes les pages) ou avis de non-imposition complet",
        "current": "Avis d'imposition incomplet (pages manquantes)"
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
      "tax-wrong-year": {
        "title": "Avis d'imposition trop ancien",
        "current": "Avis d'imposition {taxYear} sur revenus {incomeYear}",
        "expected": "Avis d'imposition {taxYear} sur revenus {incomeYear} ou avis de non-imposition"
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
