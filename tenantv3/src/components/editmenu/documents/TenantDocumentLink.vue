<template>
  <DocumentLink
    :person-type="PersonType.TENANT"
    :document-type="documentType"
    :status="status"
    :active="link.isActive.value"
  />
</template>

<script setup lang="ts">
import DocumentLink from './DocumentLink.vue'
import { DocumentService } from '@/services/DocumentService'
import { DocumentType, TENANT_COMPONENTS } from './DocumentType'
import { PersonType } from './PersonType'
import { computed } from 'vue'
import { useLink } from 'vue-router'

const props = defineProps<{
  documentType: DocumentType
}>()

const link = useLink({ to: { name: TENANT_COMPONENTS[props.documentType] } })

const status = computed(() => DocumentService.tenantStatus(props.documentType) || '')
</script>
