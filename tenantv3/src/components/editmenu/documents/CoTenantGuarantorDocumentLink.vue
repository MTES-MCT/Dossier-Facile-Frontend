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
    :status="status"
    :active="active"
    :to="to"
  />
</template>

<script setup lang="ts">
import DocumentLink from './DocumentLink.vue'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { DocumentService } from '@/services/DocumentService'
import { DocumentType } from './DocumentType'
import { PersonType } from './PersonType'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  guarantor: Guarantor
  coTenant: CoTenant
  documentType: DocumentType
  substep: number
  active: boolean
  to?: RouteLocationRaw
}>()

const status = computed(
  () => DocumentService.guarantorStatus(props.documentType, props.guarantor) || ''
)
</script>
