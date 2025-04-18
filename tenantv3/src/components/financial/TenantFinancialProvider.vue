<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import { computed, provide } from 'vue'
import { financialKey } from '@/components/financial/financialState'
import { useMainActivityLink } from '@/components/mainActivity/lib/useMainActivityLink'
const store = useTenantStore()
const mainActivityLink = useMainActivityLink()

provide(financialKey, {
  category: 'financial',
  textKey: 'tenant',
  previousStep: mainActivityLink.value,
  nextStep: { name: 'TenantTax' },
  recap: { name: 'TenantFinancial' },
  documents: computed(() => store.financialDocuments),
  action: 'saveTenantFinancial',
  userId: undefined
})
</script>
