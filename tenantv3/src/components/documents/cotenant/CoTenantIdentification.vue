<template>
  <div>
    <DocumentDownloader
      :coTenantId="coTenantId"
      :documentsDefinitions="documentsDefinitions"
      documentCategory="IDENTIFICATION"
      dispatchMethodName="saveTenantIdentification"
      typeDocument="typeDocumentIdentification"
    >
      <template v-slot:title>
        {{ $t('cotenantidentification.title') }}
      </template>
      <template v-slot:description>
        <p>{{ $t('cotenantidentification.description') }}</p>
      </template>
    </DocumentDownloader>
  </div>
</template>

<script setup lang="ts">
import { DocumentTypeConstants } from '../share/DocumentTypeConstants'
import DocumentDownloader from './DocumentDownloader.vue'

const documentsDefinitions = DocumentTypeConstants.IDENTIFICATION_DOCS

const props = defineProps<{
  coTenantId: number
}>()
</script>

<style scoped lang="scss"></style>
