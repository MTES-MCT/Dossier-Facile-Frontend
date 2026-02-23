<template>
  <RouterView />
</template>

<script setup lang="ts">
import { financialKey } from '@/components/financial/financialState'
import { useMainActivityLink } from '@/components/mainActivity/lib/useMainActivityLink'
import { useTaxLink } from '@/components/tax/lib/taxLink'
import { useHandleValidationNavigation } from '@/composables/useInternalNavigation'
import { useTenantStore } from '@/stores/tenant-store'
import { computed, provide } from 'vue'

const store = useTenantStore()
const mainActivityLink = useMainActivityLink()
const taxLink = useTaxLink()
const { getNavigationNextStep } = useHandleValidationNavigation()

const nextStep = getNavigationNextStep(taxLink.value)

provide(financialKey, {
  category: 'financial',
  textKey: 'tenant',
  previousStep: mainActivityLink.value,
  nextStep: nextStep,
  recap: { name: 'TenantFinancial' },
  documents: computed(() => store.financialDocuments),
  action: 'saveTenantFinancial',
  userId: undefined
})
</script>
