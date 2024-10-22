<template>
  <div>
    <router-link
      :to="{
        name: getTargetComponent(),
        force: true,
        params: routerParams
      }"
    >
      <ColoredTag :text="getText()" :status="status" :active="active"></ColoredTag>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import ColoredTag from 'df-shared-next/src/components/ColoredTag.vue'
import { DocumentType, DocumentTypeTranslations } from './DocumentType'
import { useI18n } from 'vue-i18n'
import type { PersonType } from './PersonType'
import type { RouteParamsRawGeneric } from 'vue-router'

const { t } = useI18n()

const props = defineProps<{
  personType: PersonType
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

function getText(): string {
  const translationKey = DocumentTypeTranslations[props.documentType]
  return t(translationKey).toString()
}

function getTargetComponent() {
  return componentsPerType[props.personType]
}
</script>

<style scoped lang="css">
[href] {
  box-shadow: none;
  background-image: none;
}
</style>
