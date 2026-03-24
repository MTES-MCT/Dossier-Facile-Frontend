<template>
  <a
    :class="anchorClass"
    :href="url"
    :title="`${label} - ${t('new-window')}`"
    target="_blank"
    rel="noopener noreferrer"
    @click="AnalyticsService.tenantIdentityOpenExternalDoc(event)"
  >
    {{ label }}
  </a>
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import { useI18n } from 'vue-i18n'

withDefaults(
  defineProps<{
    event: string
    url: string
    label: string
    anchorClass?: string
  }>(),
  { anchorClass: '' }
)

const { t } = useI18n()
</script>
