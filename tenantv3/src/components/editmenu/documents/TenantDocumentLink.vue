<template>
  <DocumentLink
    :person-type="PersonType.TENANT"
    :router-params="{ substep: substep }"
    :document-type="documentType"
    :status="getStatus()"
    :active="active"
  />
</template>

<script setup lang="ts">
import DocumentLink from './DocumentLink.vue'
import { DocumentService } from '@/services/DocumentService'
import { DocumentType } from './DocumentType'
import { PersonType } from './PersonType'

const props = defineProps<{
  documentType: DocumentType
  substep: number
  active: boolean
}>()

function getStatus() {
  return DocumentService.tenantStatus(props.documentType) || ''
}
</script>
