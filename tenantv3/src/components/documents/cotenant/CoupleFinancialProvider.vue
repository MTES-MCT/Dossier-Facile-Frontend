<template>
  <RouterView />
</template>

<script setup lang="ts">
import { financialKey } from '@/components/financial/financialState'
import { makeActivityLink } from '@/components/mainActivity/lib/useMainActivityLink'
import { DocumentService } from '@/services/DocumentService'
import { useTenantStore } from '@/stores/tenant-store'
import { computed, provide } from 'vue'
import { useRoute } from 'vue-router'

const store = useTenantStore()
const route = useRoute()
const tenantId = computed(() => Number(route.params.tenantId))

const mainActivityLink = computed(() => {
  const document = DocumentService.getCoTenantDocument(tenantId.value, 'PROFESSIONAL')
  const path = `/documents-colocataire/${tenantId.value}/4/3`
  return makeActivityLink(document?.documentSubCategory, path)
})

provide(financialKey, {
  category: 'couple-financial',
  textKey: 'couple',
  documents: computed(() => {
    const tenant = store.getTenant(tenantId.value)
    return tenant.documents?.filter((d) => d.documentCategory === 'FINANCIAL') ?? []
  }),
  previousStep: mainActivityLink.value,
  nextStep: { name: 'CoupleTax', params: { tenantId: tenantId.value } },
  recap: { name: 'CoupleFinancial' },
  userId: store.user.id,
  action: 'saveTenantFinancial',
  addData: (formData) => {
    formData.append('tenantId', String(tenantId.value))
  }
})
</script>
