<template>
  <DocumentLink
    :person-type="PersonType.GUARANTOR"
    :to="to"
    :router-params="{ substep: substep, guarantorId: guarantor.id }"
    :document-type="documentType"
    :status="status"
    :active="active"
  />
</template>

<script setup lang="ts">
import DocumentLink from './DocumentLink.vue'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { DocumentService } from '@/services/DocumentService'
import { DocumentType } from './DocumentType'
import { PersonType } from './PersonType'
import { computed } from 'vue'
import { makeGuarantorResidencyLink } from '@/components/guarantorResidency/makeGuarantorResidencyLink'

const props = defineProps<{
  guarantor: Guarantor
  documentType: DocumentType
  substep: number
  active: boolean
}>()

const to = computed(() =>
  props.documentType === 'RESIDENCY' ? makeGuarantorResidencyLink(props.guarantor) : undefined
)

const status = computed(
  () => DocumentService.guarantorStatus(props.documentType, props.guarantor) || ''
)
</script>
