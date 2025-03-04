<template>
  <div>
    <DocumentDownloader
      :co-tenant-id="coTenantId"
      :documents-definitions="documentsDefinitions"
      :document-category="DocumentType.PROFESSIONAL"
      dispatch-method-name="saveTenantProfessional"
      type-document="typeDocumentProfessional"
      list-type="dropDownList"
    >
      <template #title>
        {{ t('cotenantprofessional.title') }}
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

const documentsDefinitions = DocumentTypeConstants.PROFESSIONAL_DOCS

defineProps<{ coTenantId: number }>()
</script>

<style scoped lang="scss"></style>
