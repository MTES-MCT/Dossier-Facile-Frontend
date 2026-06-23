<template>
  <div class="banner-content">
    <div class="banner-title">
      <VIcon name="ri:alert-fill" :scale="1.25" color="#b34000" />
      <span class="title-text">{{ getTitle() }}</span>
    </div>
    <div class="banner-description">
      <div class="expected-doc">
        <p class="doc-label">{{ t('expected-document') }}</p>
        <BannerIconTextLine
          v-for="(line, i) in getExpectedLines()"
          :key="'expected-' + i"
          icon-name="ri:check-line"
          icon-color="#18753c"
          :text="line"
          text-class="success-text"
        />
      </div>
      <div v-if="getCurrentLines().length > 0" class="current-doc">
        <p class="doc-label">{{ t('current-document') }}</p>
        <BannerIconTextLine
          v-for="(line, i) in getCurrentLines()"
          :key="'current-' + i"
          icon-name="ri:close-line"
          icon-color="#b34000"
          :text="line"
          text-class="error-text"
        />
      </div>
    </div>
    <hr class="banner-separator" />
    <p class="explain-link-text">
      {{ notMatchingLabel }}
      <button type="button" class="explain-link" @click="emit('explain')">
        {{ explainLinkLabel }}
      </button>
    </p>
    <hr class="banner-separator fr-mt-1w" />
    <p class="explain-link-text">
      {{ t('contact-us.title') }}
      <a href="/contact">{{ t('contact-us.button') }}</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import BannerIconTextLine from '@/components/analysis/BannerIconTextLine.vue'
import { VIcon } from '@gouvminint/vue-dsfr'
import type { DocumentRule, Name } from 'df-shared-next/src/models/DocumentRule'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { taxYear } from './taxYear'

const props = defineProps<{
  rule: DocumentRule
  notMatchingLabel: string
  explainLinkLabel: string
}>()

const emit = defineEmits<{
  explain: []
}>()

const { t } = useI18n()

type PropertyTaxCase = 'classification' | 'leaf' | 'names' | 'wrong-year' | 'unknown'

const ruleCase = computed<PropertyTaxCase>(() => {
  switch (props.rule.rule) {
    case 'R_DOCUMENT_IA_CLASSIFICATION':
      return 'classification'
    case 'R_PROPERTY_TAX_LEAF':
      return 'leaf'
    case 'R_PROPERTY_TAX_NAMES':
      return 'names'
    case 'R_PROPERTY_TAX_WRONG_YEAR':
      return 'wrong-year'
    default:
      return 'unknown'
  }
})

function formatName(name: Name): string {
  return `${name.lastName} ${name.firstNames}`.trim()
}

function getTitle(): string {
  switch (ruleCase.value) {
    case 'classification':
      return t('bad-classification.title')
    case 'leaf':
      return t('leaf.title')
    case 'names':
      return t('names.title')
    case 'wrong-year':
      return t('wrong-year.title')
    default:
      return props.rule.message
  }
}

function getExpectedLines(): string[] {
  if (ruleCase.value === 'names' && props.rule.ruleData?.type === 'R_TAX_NAMES') {
    return [t('names.expected', { name: formatName(props.rule.ruleData.expectedName) })]
  }
  if (ruleCase.value === 'wrong-year' && props.rule.ruleData?.type === 'R_TAX_YEARS') {
    return [t('wrong-year.expected', { year: props.rule.ruleData.expectedYear })]
  }
  return [t('default-expected', { year: taxYear })]
}

function getCurrentLines(): string[] {
  if (ruleCase.value === 'classification') {
    return [t('bad-classification.current')]
  }
  if (ruleCase.value === 'names' && props.rule.ruleData?.type === 'R_TAX_NAMES') {
    return props.rule.ruleData.extractedIdentities.map((name) => t('names.current', { name }))
  }
  if (ruleCase.value === 'wrong-year' && props.rule.ruleData?.type === 'R_TAX_YEARS') {
    return props.rule.ruleData.extractedYears.map((year) => t('wrong-year.current', { year }))
  }
  return []
}
</script>

<style scoped>
@import '../../analysis/analysisBannerLayout.css';

.success-text {
  color: var(--text-default-success);
}

.error-text {
  color: var(--text-default-warning);
}

.banner-separator {
  width: 100%;
  border: 0;
  border-top: 1px solid var(--g400);
  margin: 0 0 0 0;
  padding-bottom: 0;
}
</style>

<i18n lang="json">
{
  "en": {
    "expected-document": "Expected document",
    "current-document": "Current document",
    "default-expected": "Property tax {year} (minimum 2 pages)",
    "bad-classification": {
      "title": "Incorrect document type",
      "current": "Non-compliant document"
    },
    "leaf": {
      "title": "Incomplete document"
    },
    "names": {
      "title": "Name does not match",
      "expected": "Property tax notice in the name of {name}",
      "current": "Property tax notice in the name of {name}"
    },
    "wrong-year": {
      "title": "Property tax notice too old",
      "expected": "{year} property tax notice",
      "current": "{year} property tax notice"
    },
    "contact-us": {
      "title": "Need help?",
      "button": "Contact support"
    }
  },
  "fr": {
    "expected-document": "Document attendu",
    "current-document": "Document fourni",
    "default-expected": "Taxe foncière {year} (2 pages minimum)",
    "bad-classification": {
      "title": "Type de document incorrect",
      "current": "Autre document non conforme"
    },
    "leaf": {
      "title": "Document incomplet"
    },
    "names": {
      "title": "Le nom ne correspond pas",
      "expected": "Avis de taxe foncière au nom de {name}",
      "current": "Avis de taxe foncière au nom de {name}"
    },
    "wrong-year": {
      "title": "Avis de taxe foncière trop ancien",
      "expected": "Avis de taxe foncière {year}",
      "current": "Avis de taxe foncière {year}"
    },
    "contact-us": {
      "title": "Vous avez besoin d'aide ?",
      "button": "Contacter le support"
    }
  }
}
</i18n>
