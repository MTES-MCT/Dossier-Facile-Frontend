<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import { computed, provide } from 'vue'
import { financialKey } from '@/components/financial/financialState'
import { useGuarantorId } from '@/components/guarantorResidency/useGuarantorId'
import { useRoute } from 'vue-router'

const store = useTenantStore()
const route = useRoute()
const guarantorId = useGuarantorId()
const tenantId = computed(() => Number(route.params.tenantId))

provide(financialKey, {
  category: 'couple-guarantor-financial',
  textKey: 'couple',
  documents: computed(() => store.guarantorFinancialDocuments),
  previousStep: {
    name: 'TenantGuarantorProfessional',
    params: { tenantId: tenantId.value, guarantorId: guarantorId.value }
  },
  nextStep: {
    name: 'TenantGuarantorTax',
    params: { tenantId: tenantId.value, guarantorId: guarantorId.value }
  },
  recap: { name: 'TenantGuarantorFinancial' },
  userId: store.user.id,
  action: 'saveGuarantorFinancial',
  addData: (formData) => {
    formData.append('tenantId', tenantId.value.toString())
    formData.append('guarantorId', guarantorId.value)
    const docId = formData.get('id')
    if (docId) {
      formData.append('documentId', docId)
      formData.delete('id')
    }
  }
})
</script>
