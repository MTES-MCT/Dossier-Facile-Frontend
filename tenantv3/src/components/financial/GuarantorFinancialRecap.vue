<template>
  <FinancialRecap />
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import { computed, provide } from 'vue'
import { financialKey } from '@/components/financial/financialState'
import FinancialRecap from '@/components/financial/FinancialRecap.vue'
import { useGuarantorId } from '@/components/guarantorResidency/useGuarantorId'
const store = useTenantStore()
const guarantorId = useGuarantorId()

provide(financialKey, {
  category: 'guarantor-financial',
  textKey: 'tenant',
  documents: computed(() => store.guarantorFinancialDocuments),
  previousStep: `/info-garant/3/${guarantorId.value}`,
  nextStep: `/info-garant/5/${guarantorId.value}`,
  recap: { name: 'GuarantorFinancial' },
  userId: store.user.id,
  action: 'saveGuarantorFinancial',
  addData: (formData) => {
    formData.append('guarantorId', guarantorId.value)
    const docId = formData.get('id')
    if (docId) {
      formData.append('documentId', docId)
      formData.delete('id')
    }
  }
})
</script>
