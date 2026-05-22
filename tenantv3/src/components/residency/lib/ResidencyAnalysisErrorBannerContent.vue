<template>
  <div class="banner-content">
    <div class="banner-title">
      <VIcon name="ri:alert-fill" :scale="1.25" color="#b34000" />
      <span class="title-text">{{ title }}</span>
    </div>
    <div class="banner-description">
      <div class="current-doc">
        <p class="doc-label">{{ firstSubTitle }}</p>
      </div>
      <div class="expected-doc">
        <slot name="expected-doc" />
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
      <a href="/contact">
        {{ t('contact-us.button') }}
      </a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from '@gouvminint/vue-dsfr'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import { useI18n } from 'vue-i18n'

defineProps<{
  rule: DocumentRule
  document?: DfDocument
  notMatchingLabel: string
  explainLinkLabel: string
  title: string
  firstSubTitle: string
}>()

const emit = defineEmits<{
  explain: []
}>()

const { t } = useI18n()
</script>

<style scoped>
@import '../../analysis/analysisBannerLayout.css';

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
    "contact-us": {
      "title": "Need help?",
      "button": "Contact support"
    }
  },
  "fr": {
    "contact-us": {
      "title": "Vous avez besoin d'aide ?",
      "button": "Contacter le support"
    }
  }
}
</i18n>
