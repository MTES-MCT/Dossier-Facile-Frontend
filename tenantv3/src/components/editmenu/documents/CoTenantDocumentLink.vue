<template>
  <DocumentLink
    :person-type="PersonType.COTENANT"
    :router-params="{ substep: substep, guarantorId: coTenant.id }"
    :document-type="documentType"
    :status="getStatus()"
    :active="active"
  />
</template>

<script setup lang="ts">
import DocumentLink from './DocumentLink.vue'
import { DocumentService } from '@/services/DocumentService'
import { DocumentType } from './DocumentType'
import { User } from 'df-shared-next/src/models/User'
import { PersonType } from './PersonType'

const props = defineProps<{
  coTenant: User
  documentType: DocumentType
  substep: number
  active: boolean
}>()

function getStatus() {
  return DocumentService.tenantStatus(props.documentType.toString(), props.coTenant) || ''
}
</script>
