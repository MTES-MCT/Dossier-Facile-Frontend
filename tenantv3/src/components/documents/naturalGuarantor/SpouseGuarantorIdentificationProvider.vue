<template>
  <NakedCard class="fr-p-md-5w fr-m-3v">
    <GuarantorBadge />
    <h1 class="fr-h4">
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
import { useGuarantorId } from '@/components/guarantorResidency/useGuarantorId'
import { makeCotenantGuarantorResidencyLink } from '@/components/guarantorResidency/makeGuarantorResidencyLink'
import GuarantorBadge from '@/components/common/GuarantorBadge.vue'
import { useRoute } from 'vue-router'
import { useHandleValidationNavigation } from '@/composables/useInternalNavigation'

const store = useTenantStore()
const guarantorId = useGuarantorId()
const route = useRoute()
const { getNavigationNextStep } = useHandleValidationNavigation()

const tenantId = computed(() => Number(route.params.tenantId))

const residencyLink = computed(() => {
  const document = store.guarantor?.documents?.find((d) => d.documentCategory === 'RESIDENCY')
  return makeCotenantGuarantorResidencyLink(tenantId.value, Number(guarantorId.value), document)
})

const nextStep = getNavigationNextStep(residencyLink.value)

provide(idDocKey, {
  category: 'couple-guarantor-identification',
  textKey: 'couple-guarantor',
  previousStep: {
    name: 'TenantGuarantorName',
    params: {
      guarantorId: guarantorId.value,
      step: route.params.step,
      tenantId: route.params.tenantId
    }
  },
  nextStep: nextStep,
  document: computed(() => store.getGuarantorIdentificationDocument),
  action: 'saveGuarantorIdentification',
  userId: store.user.id,
  addData: (formData) => {
    formData.append('tenantId', tenantId.value.toString())
    formData.append('guarantorId', guarantorId.value)
  }
})

const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "guarantor-identity-document": "Their guarantor's identity document"
  },
  "fr": {
    "guarantor-identity-document": "Pièce d’identité de son garant"
  }
}
</i18n>
