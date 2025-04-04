<template>
  <form @submit.prevent="submit">
    <FinancialFooterContent :previous-step="to ? previousStep : recap" :disabled="disabled" />
  </form>
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import { useRouter, type RouteLocationRaw } from 'vue-router'
import FinancialFooterContent from './FinancialFooterContent.vue'
import { useFinancialState } from '../financialState'

const { onSubmit, to, disabled } = defineProps<{
  onSubmit?: () => Promise<boolean>
  to?: RouteLocationRaw
  disabled?: boolean
}>()

const router = useRouter()
const { category, previousStep, recap } = useFinancialState()

const submit = async () => {
  AnalyticsService.validateFunnelStep(category)
  const goToRecap = onSubmit ? await onSubmit() : true
  if (goToRecap) {
    router.push(to || recap)
  }
}
</script>
