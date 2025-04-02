<template>
  <a
    :href="externalDoc.url"
    target="_blank"
    @click="AnalyticsService.tenantIdentityOpenExternalDoc(props.externalDoc)"
  >
    <slot> </slot>
  </a>
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import type { ExternalDocumentation } from './ExternalDocumentation'

const props = defineProps<{
  externalDoc: ExternalDocumentation
}>()
</script>
