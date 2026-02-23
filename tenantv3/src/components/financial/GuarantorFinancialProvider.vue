<template>
  <RouterView />
</template>

<script setup lang="ts">
import { financialKey } from '@/components/financial/financialState'
import { useGuarantorId } from '@/components/guarantorResidency/useGuarantorId'
import { makeGuarantorActivityLink } from '@/components/mainActivity/lib/useMainActivityLink'
import { useHandleValidationNavigation } from '@/composables/useInternalNavigation'
import { useTenantStore } from '@/stores/tenant-store'
import { computed, provide } from 'vue'
import { makeGuarantorTaxLink } from '../tax/lib/taxLink'

const store = useTenantStore()
const guarantorId = useGuarantorId()
const { getNavigationNextStep } = useHandleValidationNavigation()

const mainActivityLink = computed(() =>
  store.selectedGuarantor ? makeGuarantorActivityLink(store.selectedGuarantor) : '/liste-garants'
)
const taxLink = computed(() =>
  store.guarantor ? makeGuarantorTaxLink(store.guarantor) : `/info-garant/5/${guarantorId.value}`
)

const nextStep = getNavigationNextStep(taxLink.value)

provide(financialKey, {
  category: 'guarantor-financial',
  textKey: 'guarantor',
  documents: computed(() => store.guarantorFinancialDocuments),
  previousStep: mainActivityLink.value,
  nextStep: nextStep,
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
