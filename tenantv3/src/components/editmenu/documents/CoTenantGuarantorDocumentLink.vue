<template>
  <DocumentLink
    :person-type="PersonType.COTENANT_GUARANTOR"
    :router-params="{
      step: 5,
      substep: substep,
      tenantId: coTenant.id,
      guarantorId: guarantor.id
    }"
    :document-type="documentType"
    :status="getStatus() || ''"
    :active="active"
  />
</template>

<script setup lang="ts">
import DocumentLink from './DocumentLink.vue'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { DocumentService } from '@/services/DocumentService'
import { DocumentType } from './DocumentType'
import { PersonType } from './PersonType'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'

const props = defineProps<{
  guarantor: Guarantor
  coTenant: CoTenant
  documentType: DocumentType
  substep: number
  active: boolean
}>()

function getStatus() {
  return DocumentService.guarantorStatus(props.documentType, props.guarantor)
}
</script>
