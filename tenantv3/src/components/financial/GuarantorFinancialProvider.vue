<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import { computed, provide } from 'vue'
import { financialKey } from '@/components/financial/financialState'
import { useGuarantorId } from '@/components/guarantorResidency/useGuarantorId'
import { makeGuarantorActivityLink } from '@/components/mainActivity/lib/useMainActivityLink'
const store = useTenantStore()
const guarantorId = useGuarantorId()
const mainActivityLink = computed(() =>
  store.selectedGuarantor ? makeGuarantorActivityLink(store.selectedGuarantor) : '/liste-garants'
)

provide(financialKey, {
  category: 'guarantor-financial',
  textKey: 'guarantor',
  documents: computed(() => store.guarantorFinancialDocuments),
  previousStep: mainActivityLink.value,
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
