<template>
  <div
    :id="documentIdForInternalLink"
    class="fr-p-1w document-preview-card document-preview-card--error"
  >
    <div>
      <p class="fr-badge fr-badge--warning fr-mb-1w">
        {{ t('documents.status.to_correct') }}
      </p>
      <div class="fr-text--md fr-mb-1w">{{ label }}</div>
      <p v-if="subTitle" class="fr-text--sm text-mention fr-mb-1w">{{ subTitle }}</p>
      <hr class="fr-py-1w" />
      <ul class="fr-mt-0 fr-mb-1w">
        <li v-for="(rule, k) in failedRules" :key="k" class="fr-text--sm warning-text fr-my-0">
          {{ getRuleShortMessage(rule) }}
        </li>
      </ul>
      <div class="fr-grid-row fr-grid-row--right">
        <button class="fr-btn fr-btn--secondary" @click="goToEdit">
          {{ t('documents.status.correct') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PreviewDocument } from 'df-shared-next/src/models/User'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDocumentPreview } from './useDocumentPreview'

const props = defineProps<{
  previewDocument: PreviewDocument
  coTenantId?: number
  guarantorId?: number
}>()

const { t } = useI18n()
const { label, subTitle, documentIdForInternalLink, getRuleShortMessage, goToEdit } =
  useDocumentPreview(props.previewDocument, props.guarantorId, props.coTenantId)

const failedRules = computed(() => {
  return props.previewDocument.document?.documentAnalysisReport?.failedRules || []
})
</script>

<style scoped lang="scss">
.document-preview-card {
  background-color: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);

  &--error {
    background-color: var(--background-default-grey);
    border: 1px solid var(--red-marianne-main-472);
  }
}

.separation {
  color: var(--border-default-grey);
}

.warning-text {
  color: var(--text-default-warning);
}

.text-mention {
  color: var(--text-mention-grey);
}
</style>

<i18n>
{
  "en": {
    "documents": {
      "status": {
        "to_correct": "TO CORRECT",
        "correct": "Correct"
      }
    }
  },
  "fr": {
    "documents": {
      "status": {
        "to_correct": "À CORRIGER",
        "correct": "Corriger"
      }
    }
  }
}
</i18n>
