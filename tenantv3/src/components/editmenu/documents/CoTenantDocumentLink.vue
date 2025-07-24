<template>
  <DocumentLink
    :person-type="PersonType.COTENANT"
    :router-params="{ tenantId: coTenant.id, step: 4 }"
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
import { makeActivityLink } from '@/components/mainActivity/lib/useMainActivityLink'
import { UtilsService } from '@/services/UtilsService'
import { makeIdentityDocumentLink } from '@/components/identityDocument/lib/identityDocumentLink'

const props = defineProps<{
  coTenant: CoTenant
  documentType: DocumentType
}>()
const route = useRoute()

const status = computed(
  () => DocumentService.tenantStatus(props.documentType, props.coTenant) || ''
)

const link = useLink({
  to: {
    name: COUPLE_COMPONENTS[props.documentType],
    params: { tenantId: props.coTenant.id, step: 4 }
  }
})
const active = computed(() => link.isActive.value)

const to = computed(() => {
  const step = UtilsService.getParam(route.params.step)
  const path = `/documents-colocataire/${props.coTenant.id}/${step}`
  if (props.documentType === DocumentType.IDENTITY) {
    const document = props.coTenant.documents?.find((d) => d.documentCategory === 'IDENTIFICATION')
    return makeIdentityDocumentLink(document, `${path}/1`)
  }
  if (props.documentType === DocumentType.RESIDENCY) {
    return makeResidencyLink(props.coTenant, `${path}/2`)
  }
  if (props.documentType === DocumentType.PROFESSIONAL) {
    const document = props.coTenant.documents?.find((d) => d.documentCategory === 'PROFESSIONAL')
    return makeActivityLink(document?.documentSubCategory, `${path}/3`)
  }
  return undefined
})
</script>
