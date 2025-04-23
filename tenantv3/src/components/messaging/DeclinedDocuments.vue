<template>
  <div class="tenant-list">
    <DocumentsCard :tenant="tenant" @substep="goToTenantStep" />
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
import { useRouter } from 'vue-router'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useTenantStore } from '@/stores/tenant-store'
import DocumentsCard from './DocumentsCard.vue'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { COUPLE_ROUTES } from '../documents/cotenant/coupleRoutes'
import { useTenantStep } from '../residency/lib/useTenantStep'

const props = defineProps<{ tenant: CoTenant; isCotenant: boolean }>()

const router = useRouter()
const store = useTenantStore()
const { goToStep } = useTenantStep()

const goToGuarantorStep = (guarantor: Guarantor, substep: number) => {
  AnalyticsService.editFromAccount(substep)
  const page = store.setGuarantorPage(guarantor, substep, props.tenant.id)
  router.push(page)
}

const goToTenantStep = async (substep: number) => {
  AnalyticsService.editFromAccount(substep)
  if (props.isCotenant) {
    router.push({
      name: COUPLE_ROUTES[substep],
      params: {
        tenantId: props.tenant.id,
        step: '4'
      }
    })
    return
  }

  if (substep === 0) {
    router.push({ name: 'TenantName' })
  } else {
    goToStep(substep - 1)
  }
}
</script>

<style scoped>
.tenant-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
