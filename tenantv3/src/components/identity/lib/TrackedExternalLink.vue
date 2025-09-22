<template>
  <a
    :href="url"
    :title="`${label} - ${t('new-window')}`"
    target="_blank"
    @click="AnalyticsService.tenantIdentityOpenExternalDoc(event)"
  >
    {{ label }}
  </a>
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import { useI18n } from 'vue-i18n'
import type { ExternalDocumentationEvent } from './ExternalDocumentation'

defineProps<{ event: ExternalDocumentationEvent; url: string; label: string }>()

const { t } = useI18n()
</script>
