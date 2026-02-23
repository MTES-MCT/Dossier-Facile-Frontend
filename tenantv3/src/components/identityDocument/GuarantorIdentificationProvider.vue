<template>
  <NakedCard class="fr-p-md-5w fr-m-3v">
    <GuarantorBadge />
    <h1 class="fr-h6">
      {{ t('guarantor-identity-document') }}
    </h1>
    <RouterView />
  </NakedCard>
</template>

<script setup lang="ts">
import { idDocKey } from '@/components/identityDocument/lib/identityDocumentState'
import { useHandleValidationNavigation } from '@/composables/useInternalNavigation'
import { useTenantStore } from '@/stores/tenant-store'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import GuarantorBadge from '../common/GuarantorBadge.vue'
import { makeGuarantorResidencyLink } from '../guarantorResidency/makeGuarantorResidencyLink'
import { useGuarantorId } from '../guarantorResidency/useGuarantorId'

const store = useTenantStore()
const guarantorId = useGuarantorId()
const { getNavigationNextStep } = useHandleValidationNavigation()

const residencyLink = computed(() => {
  return store.guarantor ? makeGuarantorResidencyLink(store.guarantor) : '/liste-garants'
})

const nextStep = getNavigationNextStep(residencyLink.value)

provide(idDocKey, {
  category: 'guarantor-identification',
  textKey: 'guarantor',
  previousStep: { name: 'GuarantorName', params: { guarantorId: guarantorId.value } },
  nextStep: nextStep,
  document: computed(() => store.getGuarantorIdentificationDocument),
  action: 'saveGuarantorIdentification',
  userId: store.user.id,
  addData: (formData) => {
    formData.append('guarantorId', guarantorId.value)
  }
})

const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "guarantor-identity-document": "Your guarantor's identity document"
  },
  "fr": {
    "guarantor-identity-document": "Pièce d’identité de votre garant"
  }
}
</i18n>
