<template>
  <LoadingPreviewCard v-if="status === 'LOADING'" :preview-document="previewDocument" />
  <SuccessPreviewCard
    v-else-if="status === 'SUCCESS'"
    :preview-document="previewDocument"
    :co-tenant-id="coTenantId"
    :guarantor-id="guarantorId"
  />
  <ErrorPreviewCard
    v-else-if="status === 'ERROR'"
    :preview-document="previewDocument"
    :co-tenant-id="coTenantId"
    :guarantor-id="guarantorId"
  />
  <MissingDocumentPreviewCard
    v-else-if="status === 'MISSING'"
    :preview-document="previewDocument"
    :co-tenant-id="coTenantId"
    :guarantor-id="guarantorId"
  />
</template>

<script setup lang="ts">
import type { PreviewDocument } from 'df-shared-next/src/models/User'
import { toRef } from 'vue'
import ErrorPreviewCard from './ErrorPreviewCard.vue'
import LoadingPreviewCard from './LoadingPreviewCard.vue'
import MissingDocumentPreviewCard from './MissingDocumentPreviewCard.vue'
import SuccessPreviewCard from './SuccessPreviewCard.vue'
import { useDocumentPreview } from './useDocumentPreview'

const props = defineProps<{
  previewDocument: PreviewDocument
  guarantorId?: number
  coTenantId?: number
}>()

const { status } = useDocumentPreview(props.previewDocument)
</script>

<i18n>
{
  "en": {
  },
  "fr": {
  }
}
</i18n>
