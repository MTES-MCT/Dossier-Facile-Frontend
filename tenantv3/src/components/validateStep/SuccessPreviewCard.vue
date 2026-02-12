<template>
  <div class="fr-p-1w document-preview-card">
    <div class="document-preview-card__content">
      <div class="file-info-container">
        <div class="file-name">
          <RiCheckboxCircleFill size="20px" class="icon bleue" aria-hidden="true" />
          <span class="fr-ml-1w">{{ label }}</span>
        </div>
        <p v-if="subTitle" class="fr-text--sm text-mention fr-mb-0">{{ subTitle }}</p>
      </div>
      <div class="actions">
        <button class="fr-btn fr-btn--secondary fr-btn--sm fr-mr-1w" @click="isModalOpened = true">
          {{ t('filerowlistitem.see') }}
        </button>
        <button class="fr-btn fr-btn--secondary fr-btn--sm" @click="goToEdit">
          {{ t('documents.edit') }}
        </button>
      </div>
    </div>
    <DsfrModalPatched v-model:is-opened="isModalOpened" :title="modalTitle" size="xl">
      <template #default>
        <ShowDoc
          v-if="isModalOpened"
          :file="previewDocument.document!"
          :watermark-url="previewDocument.document?.name"
        />
      </template>
    </DsfrModalPatched>
  </div>
</template>

<script setup lang="ts">
import { RiCheckboxCircleFill } from '@remixicon/vue'
import DsfrModalPatched from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import type { PreviewDocument } from 'df-shared-next/src/models/User'
import { useI18n } from 'vue-i18n'
import { useDocumentPreview } from './useDocumentPreview'
import { computed, ref } from 'vue'
import ShowDoc from '../documents/share/ShowDoc.vue'

const props = defineProps<{
  previewDocument: PreviewDocument
  guarantorId?: number
  coTenantId?: number
}>()

console.log('previewDocument', props.previewDocument)

const { t } = useI18n()
const { label, subTitle, goToEdit } = useDocumentPreview(
  props.previewDocument,
  props.guarantorId,
  props.coTenantId
)

const isModalOpened = ref(false)

const modalTitle = computed(() => {
  if (subTitle.value) {
    return t('preview_subtitle', { label: label.value, subTitle: subTitle.value })
  } else {
    return t('preview_title', { label: label.value })
  }
})
</script>

<style scoped lang="scss">
.document-preview-card {
  background-color: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);

  &__content {
    display: flex;
    flex-direction: column;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }
}

.file-info-container {
  width: 100%;
}

.file-name {
  display: flex;
  align-items: center;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  @media (min-width: 768px) {
    margin-top: 0;
    margin-left: auto;
  }
}

.icon {
  flex-shrink: 0;
}

.bleue {
  color: var(--blue-france-sun-113-625);
}

.text-mention {
  color: var(--text-mention-grey);
}
</style>

<i18n>
{
  "en": {
    "edit": "Edit",
    "preview_title": "Document preview: {label}",
    "preview_subtitle": "Document preview: {label}, {subTitle}"
  },
  "fr": {
    "edit": "Modifier",
    "preview_title": "Aperçu du document : {label}",
    "preview_subtitle": "Aperçu du document : {label}, {subTitle}"
  }
}
</i18n>
