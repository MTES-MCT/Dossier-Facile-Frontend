<template>
  <div
    :id="documentIdForInternalLink"
    class="fr-p-1w document-preview-card document-preview-card--error"
  >
    <div>
      <DsfrBadge type="warning" :label="t('documents.status.to_correct')" class="fr-mb-1w" />
      <div class="fr-text--md fr-mb-1w">{{ label }}</div>
      <p v-if="subTitle" class="fr-text--sm text-mention fr-mb-1w">{{ subTitle }}</p>
      <hr class="fr-py-1w" />
      <ul class="fr-mt-0 fr-mb-1w">
        <li v-for="(rule, k) in failedRules" :key="k" class="fr-text--sm warning-text fr-my-0">
          {{ getRuleShortMessage(rule) }}
        </li>
      </ul>
      <div class="fr-grid-row fr-grid-row--right">
        <a href="#" class="fr-btn fr-btn--secondary" @click.prevent="editPressed">
          {{ t('documents.status.correct') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DsfrBadge } from '@gouvminint/vue-dsfr'
import { AnalyticsService } from '@/services/AnalyticsService'
import type { PreviewDocument } from 'df-shared-next/src/models/User'
import { computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDocumentPreview } from './useDocumentPreview'

const props = defineProps<{
  previewDocument: PreviewDocument
  coTenantId?: number
  guarantorId?: number
}>()

const { t } = useI18n()
const { label, subTitle, documentIdForInternalLink, getRuleShortMessage, goToEdit } =
  useDocumentPreview(toRef(props, 'previewDocument'), props.guarantorId, props.coTenantId)

const failedRules = computed(() => {
  return props.previewDocument.documentAnalysisStatus?.failedRules || []
})

const editPressed = () => {
  const documentCategory =
    props.previewDocument.document?.documentCategory || props.previewDocument.documentCategory
  if (props.coTenantId === undefined && props.guarantorId === undefined) {
    AnalyticsService.validate_correct_error_click('tenant', documentCategory)
  } else if (props.guarantorId !== undefined) {
    AnalyticsService.validate_correct_error_click('guarantor', documentCategory)
  } else if (props.coTenantId !== undefined) {
    AnalyticsService.validate_correct_error_click('couple', documentCategory)
  }
  goToEdit()
}
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
