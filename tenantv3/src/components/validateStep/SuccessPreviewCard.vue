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
        <a :href="getEditLink()" class="fr-btn fr-btn--secondary fr-btn--sm">
          {{ t('documents.edit') }}
        </a>
      </div>
    </div>
    <div v-if="isFailedRuleSkiped" :class="subTitle ? 'fr-mt-1w' : 'fr-mt-2w'">
      <hr class="fr-pb-1w" />
      <div class="fr-text--sm fr-mb-0">
        <p class="fr-mb-0">{{ t('explaination-message') }}</p>
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
import { computed, ref, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import ShowDoc from '../documents/share/ShowDoc.vue'
import { useDocumentPreview } from './useDocumentPreview'

const props = defineProps<{
  previewDocument: PreviewDocument
  guarantorId?: number
  coTenantId?: number
}>()

const { t } = useI18n()
const { label, subTitle, getEditLink } = useDocumentPreview(
  toRef(props, 'previewDocument'),
  props.guarantorId,
  props.coTenantId
)

const isModalOpened = ref(false)

const isFailedRuleSkiped = computed(
  () => (props.previewDocument.document?.documentAnalysisReport?.comment?.length ?? 0) > 0
)

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

<i18n lang="json">
{
  "en": {
    "edit": "Edit",
    "preview_title": "Document preview: {label}",
    "preview_subtitle": "Document preview: {label}, {subTitle}",
    "explaination-message": "Your explanation has been sent to our team for verification."
  },
  "fr": {
    "edit": "Modifier",
    "preview_title": "Aperçu du document : {label}",
    "preview_subtitle": "Aperçu du document : {label}, {subTitle}",
    "explaination-message": "Votre explication a été transmise à notre équipe pour vérification."
  }
}
</i18n>
