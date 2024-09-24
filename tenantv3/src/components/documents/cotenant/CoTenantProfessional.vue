<template>
  <div>
    <DocumentDownloader
      :coTenantId="coTenantId"
      :documentsDefinitions="documentsDefinitions"
      documentCategory="PROFESSIONAL"
      dispatchMethodName="saveTenantProfessional"
      typeDocument="typeDocumentProfessional"
      listType="dropDownList"
    >
      <template v-slot:title>
        {{ $t('cotenantprofessional.title') }}
      </template>
    </DocumentDownloader>
  </div>
</template>

<script setup lang="ts">
import { DocumentTypeConstants } from '../share/DocumentTypeConstants'
import DocumentDownloader from './DocumentDownloader.vue'

const documentsDefinitions = DocumentTypeConstants.PROFESSIONAL_DOCS

const props = defineProps<{
  coTenantId: number
}>()
</script>

<style scoped lang="scss"></style>
