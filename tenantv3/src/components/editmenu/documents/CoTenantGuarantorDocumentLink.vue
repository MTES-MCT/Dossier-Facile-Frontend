<template>
  <DocumentLink
    :person-type="PersonType.COTENANT_GUARANTOR"
    :router-params="{
      step: 5,
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
import { DocumentType, TENANT_GUARANTOR_COMPONENTS } from './DocumentType'
import { PersonType } from './PersonType'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import { computed } from 'vue'
import { useLink, type RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  guarantor: Guarantor
  coTenant: CoTenant
  documentType: DocumentType
  to?: RouteLocationRaw
}>()

const status = computed(
  () => DocumentService.guarantorStatus(props.documentType, props.guarantor) || ''
)
const link = useLink({
  to: {
    name: TENANT_GUARANTOR_COMPONENTS[props.documentType],
    params: { guarantorId: props.guarantor.id, tenantId: props.coTenant.id }
  }
})
const active = computed(() => link.isActive.value)
</script>
