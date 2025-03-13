<template>
  <div>
    <DocumentDownloader
      :co-tenant-id="coTenantId"
      :documents-definitions="documentsDefinitions"
      :document-category="DocumentType.IDENTIFICATION"
      dispatch-method-name="saveTenantIdentification"
      type-document="typeDocumentIdentification"
    >
      <template #title>
        {{ t('cotenantidentification.title') }}
      </template>
      <template #description>
        <p>{{ t('cotenantidentification.description') }}</p>
      </template>
    </DocumentDownloader>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DocumentTypeConstants } from '../share/DocumentTypeConstants'
import DocumentDownloader from './DocumentDownloader.vue'
import { DocumentType } from '@/components/editmenu/documents/DocumentType'

const { t } = useI18n()

const documentsDefinitions = DocumentTypeConstants.IDENTIFICATION_DOCS

defineProps<{ coTenantId: number }>()
</script>

<style scoped lang="scss"></style>
