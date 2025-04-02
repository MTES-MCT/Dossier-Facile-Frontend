<template>
  <a :href="externalDoc.url" target="_blank" @click="onExternalLinkClicked">
    <slot> </slot>
  </a>
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import type { ExternalDocumentation } from './ExternalDocumentation'

const props = defineProps<{
  externalDoc: ExternalDocumentation
}>()

const onExternalLinkClicked = () => {
  AnalyticsService.tenantIdentityOpenExternalDoc(props.externalDoc)
}
</script>
