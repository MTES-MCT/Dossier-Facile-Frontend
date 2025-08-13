<template>
  <div>
    <router-link :to="to">
      <ColoredTag :text="text" :status="status" :active="active"></ColoredTag>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import ColoredTag from 'df-shared-next/src/components/ColoredTag.vue'
import {
  COUPLE_COMPONENTS,
  DocumentType,
  DocumentTypeTranslations,
  GUARANTOR_COMPONENTS,
  TENANT_COMPONENTS,
  TENANT_GUARANTOR_COMPONENTS
} from './DocumentType'
import { useI18n } from 'vue-i18n'
import { PersonType } from './PersonType'
import type { RouteLocationRaw, RouteParamsRawGeneric } from 'vue-router'
import { computed } from 'vue'
import { useResidencyLink } from '@/components/residency/lib/useResidencyLink'
import { useMainActivityLink } from '@/components/mainActivity/lib/useMainActivityLink'
import { useIdentityDocumentLink } from '@/components/identityDocument/lib/identityDocumentLink'
import { useTaxLink } from '@/components/tax/lib/taxLink'

const { t } = useI18n()
const residencyLink = useResidencyLink()
const mainActivityLink = useMainActivityLink()
const identificationLink = useIdentityDocumentLink()
const taxLink = useTaxLink()

const props = defineProps<{
  personType: PersonType
  to?: RouteLocationRaw
  routerParams?: RouteParamsRawGeneric
  documentType: DocumentType
  status: string
  active: boolean
}>()

const componentsPerType: { [type in PersonType]: string } = {
  TENANT: 'TenantDocuments',
  GUARANTOR: 'GuarantorDocuments',
  COTENANT: 'CoTenantDocuments',
  COTENANT_GUARANTOR: 'TenantGuarantorDocuments'
}

const text = computed(() => t(DocumentTypeTranslations[props.documentType]))

function getTargetComponent() {
  if (props.personType === PersonType.TENANT) {
    return TENANT_COMPONENTS[props.documentType]
  }
  if (props.personType === PersonType.GUARANTOR) {
    return GUARANTOR_COMPONENTS[props.documentType]
  }
  if (props.personType === PersonType.COTENANT) {
    return COUPLE_COMPONENTS[props.documentType]
  }
  if (props.personType === PersonType.COTENANT_GUARANTOR) {
    return TENANT_GUARANTOR_COMPONENTS[props.documentType]
  }
  return componentsPerType[props.personType]
}

const to = computed(() => {
  if (props.to) {
    return props.to
  }
  const name = getTargetComponent()
  if (name === 'TenantResidency') {
    return residencyLink.value
  }
  if (name === 'TenantProfessional') {
    return mainActivityLink.value
  }
  if (name === 'TenantIdentification') {
    return identificationLink.value
  }
  if (name === 'TenantTax') {
    return taxLink.value
  }
  return {
    name,
    force: true,
    params: props.routerParams
  }
})
</script>

<style scoped lang="css">
[href] {
  box-shadow: none;
  background-image: none;
}
</style>
