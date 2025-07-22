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
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'
import { computed, provide } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { idDocKey } from '@/components/identityDocument/lib/identityDocumentState'
import { useGuarantorId } from '../guarantorResidency/useGuarantorId'
import GuarantorBadge from '../common/GuarantorBadge.vue'
import { makeGuarantorResidencyLink } from '../guarantorResidency/makeGuarantorResidencyLink'

const store = useTenantStore()
const guarantorId = useGuarantorId()

const residencyLink = computed(() => {
  return store.guarantor ? makeGuarantorResidencyLink(store.guarantor) : '/liste-garants'
})

provide(idDocKey, {
  category: 'guarantor-identification',
  textKey: 'guarantor',
  previousStep: { name: 'GuarantorName', params: { guarantorId: guarantorId.value } },
  nextStep: residencyLink.value,
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
