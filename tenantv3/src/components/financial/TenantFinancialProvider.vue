<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import { computed, provide } from 'vue'
import { financialKey } from '@/components/financial/financialState'
import { useMainActivityLink } from '@/components/mainActivity/lib/useMainActivityLink'
import { useTaxLink } from '@/components/tax/lib/taxLink'
const store = useTenantStore()
const mainActivityLink = useMainActivityLink()
const taxLink = useTaxLink()

provide(financialKey, {
  category: 'financial',
  textKey: 'tenant',
  previousStep: mainActivityLink.value,
  nextStep: taxLink.value,
  recap: { name: 'TenantFinancial' },
  documents: computed(() => store.financialDocuments),
  action: 'saveTenantFinancial',
  userId: undefined
})
</script>
