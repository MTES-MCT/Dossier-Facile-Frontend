<template>
  <form @submit.prevent="submit">
    <FinancialFooterContent />
  </form>
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import { useRouter, type RouteLocationRaw } from 'vue-router'
import FinancialFooterContent from './FinancialFooterContent.vue'

const { onSubmit, to } = defineProps<{ onSubmit?: () => Promise<boolean>; to?: RouteLocationRaw }>()

const router = useRouter()

const submit = async () => {
  AnalyticsService.validateFunnelStep('financial')
  const goToRecap = onSubmit ? await onSubmit() : true
  if (goToRecap) {
    router.push(to || { name: 'TenantFinancial' })
  }
}
</script>
