<template>
  <DocumentLink
    :person-type="PersonType.COTENANT"
    :router-params="{ tenantId: coTenant.id }"
    :document-type="documentType"
    :status="status"
    :active="active"
    :to="to"
  />
</template>

<script setup lang="ts">
import DocumentLink from './DocumentLink.vue'
import { DocumentService } from '@/services/DocumentService'
import { COUPLE_COMPONENTS, DocumentType } from './DocumentType'
import { PersonType } from './PersonType'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import { computed } from 'vue'
import { makeResidencyLink } from '@/components/residency/lib/useResidencyLink'
import { useLink, useRoute } from 'vue-router'

const props = defineProps<{
  coTenant: CoTenant
  documentType: DocumentType
}>()
const route = useRoute()

const status = computed(
  () => DocumentService.tenantStatus(props.documentType, props.coTenant) || ''
)

const link = useLink({
  to: { name: COUPLE_COMPONENTS[props.documentType], params: { tenantId: props.coTenant.id } }
})
const active = computed(() => link.isActive.value)

const to = computed(() => {
  if (props.documentType !== 'RESIDENCY') {
    return undefined
  }
  const step = route.params.step
  return makeResidencyLink(props.coTenant, `/documents-colocataire/${props.coTenant.id}/${step}/2`)
})
</script>
