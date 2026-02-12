<template>
  <div class="fr-p-1w document-preview-card">
    <div class="document-preview-card__content">
      <RiHourglassFill size="20px" class="icon bleue" aria-hidden="true" />
      <span class="fr-ml-1w">{{ label }}</span>
    </div>
    <p v-if="subTitle" class="fr-text--sm text-mention fr-mb-0">{{ subTitle }}</p>
  </div>
</template>

<script setup lang="ts">
import { RiHourglassFill } from '@remixicon/vue'
import type { PreviewDocument } from 'df-shared-next/src/models/User'
import { toRef } from 'vue'
import { useDocumentPreview } from './useDocumentPreview'

const props = defineProps<{
  previewDocument: PreviewDocument
}>()

const { label, subTitle } = useDocumentPreview(toRef(props, 'previewDocument'))
</script>

<style scoped lang="scss">
.document-preview-card {
  background-color: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);

  &__content {
    display: flex;
    align-items: center;
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
  },
  "fr": {
  }
}
</i18n>
