<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-grid-col">
    <h2 class="fr-h6">{{ t('main-activity') }}</h2>
    <RouterView />
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'
import { computed, provide } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { mainActivityKey } from '@/components/mainActivity/lib/mainActivityState'
import { useGuarantorId } from '@/components/guarantorResidency/useGuarantorId'
import { makeGuarantorResidencyLink } from '@/components/guarantorResidency/makeGuarantorResidencyLink'
const { t } = useI18n()
const store = useTenantStore()
const guarantorId = useGuarantorId()
const residencyLink = computed(() => {
  return store.guarantor ? makeGuarantorResidencyLink(store.guarantor) : '/liste-garants'
})

provide(mainActivityKey, {
  category: 'guarantor-professional',
  textKey: 'guarantor',
  previousStep: residencyLink.value,
  nextStep: { name: 'GuarantorFinancial' },
  document: computed(() => store.getGuarantorProfessionalDocument),
  userId: undefined,
  action: 'saveGuarantorProfessional',
  addData: (formData) => {
    formData.append('guarantorId', guarantorId.value)
  }
})
</script>

<i18n>
{
  "en": {
    "main-activity": "Main activity",
  },
  "fr": {
    "main-activity": "Activité principale"
  }
}
</i18n>
