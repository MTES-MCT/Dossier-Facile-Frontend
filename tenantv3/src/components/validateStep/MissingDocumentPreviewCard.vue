<template>
  <div class="fr-p-1w document-preview-card">
    <p class="fr-badge fr-badge--info fr-mb-1w">{{ t('missing-document') }}</p>
    <div class="document-preview-card__content">
      <div class="file-name">
        <p class="fr-text--md fr-mb-1w">{{ label }}</p>
        <p v-if="subTitle" class="fr-text--sm text-mention fr-mb-1w">{{ subTitle }}</p>
      </div>
      <div class="actions fr-ml-auto">
        <button class="fr-btn fr-btn--secondary fr-btn--sm" @click="goToEdit">
          {{ t('add-document') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PreviewDocument } from 'df-shared-next/src/models/User'
import { useDocumentPreview } from './useDocumentPreview'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  previewDocument: PreviewDocument
}>()

const { t } = useI18n()

const { label, subTitle, goToEdit } = useDocumentPreview(props.previewDocument)
</script>

<style scoped lang="scss">
.document-preview-card {
  background-color: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);

  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }
}

.file-name {
  display: flex;
  align-items: center;
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
  }
}

.actions {
  display: flex;
  margin-top: 1rem;
  @media (min-width: 768px) {
    margin-top: 0;
  }
}

.icon {
  flex-shrink: 0;
}

.bleue {
  color: var(--blue-france-sun-113-625);
}
</style>

<i18n>
{
  "en": {
    "add-document" : "Add a document",
    "missing-document": "MISSING DOCUMENT"
  },
  "fr": {
    "add-document" : "Ajouter un document",
    "missing-document": "DOCUMENT MANQUANT"
  }
}
</i18n>
