<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import { computed, provide } from 'vue'
import { financialKey } from '@/components/financial/financialState'
const store = useTenantStore()

provide(financialKey, {
  category: 'financial',
  textKey: 'tenant',
  previousStep: '/documents-locataire/3',
  nextStep: { name: 'TenantTax' },
  recap: { name: 'TenantFinancial' },
  documents: computed(() => store.financialDocuments),
  action: 'saveTenantFinancial',
  userId: undefined
})
</script>
