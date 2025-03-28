<template>
  <RouterView />
</template>

<script setup lang="ts">
import { financialKey } from '@/components/financial/financialState'
import { useTenantStore } from '@/stores/tenant-store'
import { computed, provide } from 'vue'
import { useRoute } from 'vue-router'

const store = useTenantStore()
const route = useRoute()
const tenantId = computed(() => Number(route.params.tenantId))

provide(financialKey, {
  category: 'couple-financial',
  textKey: 'couple',
  documents: computed(() => {
    const tenant = store.getTenant(tenantId.value)
    return tenant.documents?.filter((d) => d.documentCategory === 'FINANCIAL') ?? []
  }),
  previousStep: { name: 'CoupleProfessional', params: { tenantId: tenantId.value } },
  nextStep: { name: 'CoupleTax', params: { tenantId: tenantId.value } },
  recap: { name: 'CoupleFinancial' },
  userId: store.user.id,
  action: 'saveTenantFinancial',
  addData: (formData) => {
    formData.append('tenantId', String(tenantId.value))
  }
})
</script>
