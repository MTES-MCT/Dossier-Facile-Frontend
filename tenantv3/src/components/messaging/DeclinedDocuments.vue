<template>
  <div class="tenant-list">
    <DocumentsCard :tenant="tenant" @substep="goToStep" />
    <DocumentsCard
      v-for="guarantor of tenant.guarantors"
      :key="guarantor.id"
      :tenant="guarantor"
      guarantor
      @substep="goToGuarantorStep(guarantor, $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter, type RouteLocationRaw } from 'vue-router'
import { AnalyticsService } from '@/services/AnalyticsService'
import useTenantStore from '@/stores/tenant-store'
import DocumentsCard from './DocumentsCard.vue'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'

const props = defineProps<{ tenant: CoTenant; isCotenant: boolean }>()

const router = useRouter()
const store = useTenantStore()

const goToGuarantorStep = async (guarantor: Guarantor, substep: number) => {
  AnalyticsService.editFromAccount(substep)
  const page = await store.setGuarantorPage(guarantor, substep, props.tenant.id)
  router.push(page)
}

const goToStep = async (substep: number) => {
  AnalyticsService.editFromAccount(substep)
  const page: RouteLocationRaw = props.isCotenant
    ? {
        name: 'CoTenantDocuments',
        params: {
          tenantId: props.tenant.id,
          step: '4',
          substep
        }
      }
    : {
        name: 'TenantDocuments',
        params: { substep }
      }
  router.push(page)
}
</script>

<style scoped>
.tenant-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
