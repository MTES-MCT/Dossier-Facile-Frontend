<template>
  <DocumentLink
    :person-type="PersonType.GUARANTOR"
    :router-params="{ substep: substep, guarantorId: guarantor.id }"
    :document-type="documentType"
    :status="getStatus()"
    :active="active"
  />
</template>

<script setup lang="ts">
import DocumentLink from './DocumentLink.vue'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { DocumentService } from '@/services/DocumentService'
import { DocumentType } from './DocumentType'
import { PersonType } from './PersonType'

const props = defineProps<{
  guarantor: Guarantor
  documentType: DocumentType
  substep: number
  active: boolean
}>()

function getStatus() {
  return DocumentService.guarantorStatus(props.documentType.toString(), props.guarantor) || ''
}
</script>
