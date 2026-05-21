<template>
  <div class="banner-content">
    <div class="banner-title">
      <VIcon name="ri:alert-fill" :scale="1.25" color="#b34000" />
      <span class="title-text">{{ getTitle() }}</span>
    </div>
    <div class="banner-description">
      <div class="current-doc">
        <p class="doc-label">{{ getFirstSubTitle() }}</p>
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

const props = defineProps<{
  rule: DocumentRule
  document?: DfDocument
  notMatchingLabel: string
  explainLinkLabel: string
}>()

const emit = defineEmits<{
  explain: []
}>()

const { t } = useI18n()

function getTitle(): string {
  if (
    props.document &&
    props.document.documentSubCategory === 'TENANT' &&
    props.document.documentCategoryStep === 'TENANT_RECEIPT'
  ) {
    return t('bad-classification.receipt.title')
  }
  if (
    props.document &&
    props.document.documentSubCategory === 'TENANT' &&
    props.document.documentCategoryStep === 'TENANT_PROOF'
  ) {
    return t('bad-classification.proof.title')
  }
  return t('bad-classification.title')
}

function getFirstSubTitle(): string {
  return t('bad-classification.sub-title-one')
}
</script>

<style scoped>
@import '../../analysis/analysisBannerLayout.css';

.error-text {
  color: #b34000;
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
    "bad-classification": {
      "receipt": {
        "title": "Add your rent receipts"
      },
      "proof": {
        "title": "Add a proof of payment certificate"
      },
      "title": "Document classification issue",
      "sub-title-one": "Expected documents"
    },
    "document": {
      "subcategory": {
        "tenant": {
          "receipt": "Rent receipt"
        }
      }
    },
    "contact-us": {
      "title": "Need help?",
      "button": "Contact support"
    }
  },
  "fr": {
    "bad-classification": {
      "receipt": {
        "title": "Ajoutez vos quittances de loyer"
      },
      "proof": {
        "title": "Ajoutez une attestation de bon paiement"
      },
      "title": "Problème de classification de document",
      "sub-title-one": "Documents attendus"
    },
    "document": {
      "subcategory": {
        "tenant": {
          "receipt": "Quittance de loyer"
        }
      }
    },
    "contact-us": {
      "title": "Vous avez besoin d'aide ?",
      "button": "Contacter le support"
    }
  }
}
</i18n>
