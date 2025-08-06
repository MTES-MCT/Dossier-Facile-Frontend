<template>
  <DocumentLink
    :person-type="PersonType.GUARANTOR"
    :to="to"
    :router-params="{ guarantorId: guarantor.id }"
    :document-type="documentType"
    :status="status"
    :active="active"
  />
</template>

<script setup lang="ts">
import DocumentLink from './DocumentLink.vue'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { DocumentService } from '@/services/DocumentService'
import { DocumentType, GUARANTOR_COMPONENTS } from './DocumentType'
import { PersonType } from './PersonType'
import { computed } from 'vue'
import { makeGuarantorResidencyLink } from '@/components/guarantorResidency/makeGuarantorResidencyLink'
import { useLink } from 'vue-router'
import { makeGuarantorActivityLink } from '@/components/mainActivity/lib/useMainActivityLink'
import { makeGuarantorIdentityDocumentLink } from '@/components/identityDocument/lib/identityDocumentLink'

const props = defineProps<{
  guarantor: Guarantor
  documentType: DocumentType
}>()

const to = computed(() => {
  if (props.documentType === DocumentType.IDENTITY) {
    return makeGuarantorIdentityDocumentLink(props.guarantor)
  }
  if (props.documentType === DocumentType.RESIDENCY) {
    return makeGuarantorResidencyLink(props.guarantor)
  }
  if (props.documentType === DocumentType.PROFESSIONAL) {
    return makeGuarantorActivityLink(props.guarantor)
  }
  return undefined
})

const status = computed(
  () => DocumentService.guarantorStatus(props.documentType, props.guarantor) || ''
)

const link = useLink({
  to: {
    name: GUARANTOR_COMPONENTS[props.documentType],
    params: { guarantorId: props.guarantor.id }
  }
})
const active = computed(() => link.isActive.value)
</script>
