<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import { computed, provide } from 'vue'
import { financialKey } from '@/components/financial/financialState'
import { useMainActivityLink } from '@/components/mainActivity/lib/useMainActivityLink'
import { useTaxLink } from '@/components/tax/lib/taxLink'
import { useRoute } from 'vue-router'
const store = useTenantStore()
const route = useRoute()
const mainActivityLink = useMainActivityLink()
const taxLink = useTaxLink()

const isFromValidation = route.query.from === 'validation'
const nextStep = isFromValidation ? { name: 'ValidateFile' } : taxLink.value

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
