<template>
  <DocumentLink
    :person-type="PersonType.TENANT"
    :document-type="documentType"
    :status="status"
    :active="active"
  />
</template>

<script setup lang="ts">
import DocumentLink from './DocumentLink.vue'
import { DocumentService } from '@/services/DocumentService'
import { DocumentType, TENANT_COMPONENTS } from './DocumentType'
import { PersonType } from './PersonType'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  documentType: DocumentType
}>()

const route = useRoute()

const status = computed(() => DocumentService.tenantStatus(props.documentType) || '')
const active = computed(() => route.name === TENANT_COMPONENTS[props.documentType])
</script>
