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
import { taxYear } from './taxYear'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  rule: DocumentRule
  document?: DfDocument
  notMatchingLabel: string
  explainLinkLabel: string
  title?: string
  firstSubTitle?: string
}>()

const emit = defineEmits<{
  explain: []
}>()

const { t } = useI18n()

function getTitle(): string {
  if (props.title) {
    return props.title
  }
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
  if (
    props.document &&
    props.document.documentSubCategory === 'GUEST' &&
    props.document.documentCategoryStep === 'GUEST_PROOF'
  ) {
    return t('bad-classification.guest-proof.title')
  }
  if (
    props.document &&
    props.document.documentSubCategory === 'GUEST' &&
    props.document.documentCategoryStep === 'GUEST_NO_PROOF'
  ) {
    return t('bad-classification.guest-no-proof.title')
  }
  if (
    props.document &&
    props.document.documentSubCategory === 'OWNER' &&
    !props.document.documentCategoryStep
  ) {
    return t('bad-classification.owner.title', [taxYear])
  }
  return t('bad-classification.title')
}

function getFirstSubTitle(): string {
  if (props.firstSubTitle) {
    return props.firstSubTitle
  }
  if (
    props.document &&
    props.document.documentSubCategory === 'GUEST' &&
    props.document.documentCategoryStep === 'GUEST_PROOF'
  ) {
    return t('bad-classification.guest-proof.sub-title-one')
  }
  if (
    props.document &&
    props.document.documentSubCategory === 'GUEST' &&
    props.document.documentCategoryStep === 'GUEST_NO_PROOF'
  ) {
    return t('bad-classification.guest-no-proof.sub-title-one')
  }
  if (
    props.document &&
    props.document.documentSubCategory === 'OWNER' &&
    !props.document.documentCategoryStep
  ) {
    return t('bad-classification.owner.sub-title-one')
  }
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
      "guest-proof": {
        "title": "Add your proof of accommodation",
        "sub-title-one": "Expected document"
      },
      "guest-no-proof": {
        "title": "Add your proof of accommodation",
        "sub-title-one": "Expected document"
      },
      "owner": {
        "title": "Add your property tax notice {0}",
        "sub-title-one": "Expected document"
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
      "guest-proof": {
        "title": "Ajoutez votre attestation d'hébergement",
        "sub-title-one": "Document attendu"
      },
      "guest-no-proof": {
        "title": "Ajoutez votre attestation d'hébergement",
        "sub-title-one": "Document attendu"
      },
      "owner": {
        "title": "Ajoutez votre avis de taxe foncière {0}",
        "sub-title-one": "Document attendu"
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
