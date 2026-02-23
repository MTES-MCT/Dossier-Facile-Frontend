<template>
  <NakedCard class="fr-p-md-5w fr-m-3v">
    <GuarantorBadge />
    <h1 class="fr-h4">{{ t('guarantor-residency-situation') }}</h1>
    <router-view />
  </NakedCard>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { residencyKey } from '../residency/residencyState'
import { useTenantStore } from '@/stores/tenant-store'
import { useGuarantorId } from './useGuarantorId'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { makeGuarantorActivityLink } from '@/components/mainActivity/lib/useMainActivityLink'
import GuarantorBadge from '../common/GuarantorBadge.vue'
import { makeGuarantorIdentityDocumentLink } from '../identityDocument/lib/identityDocumentLink'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const store = useTenantStore()
const guarantorId = useGuarantorId()
const identityDocumentLink = computed(() =>
  store.selectedGuarantor
    ? makeGuarantorIdentityDocumentLink(store.selectedGuarantor)
    : '/liste-garants'
)
const mainActivityLink = computed(() =>
  store.selectedGuarantor ? makeGuarantorActivityLink(store.selectedGuarantor) : '/liste-garants'
)

const isFromValidation = route.query.from === 'validation'
const nextStep = isFromValidation ? { name: 'ValidateFile' } : mainActivityLink.value

provide(residencyKey, {
  category: 'guarantor-residency',
  textKey: 'tenant',
  previousStep: identityDocumentLink.value,
  nextStep: nextStep,
  document: computed(() => store.getGuarantorResidencyDocument),
  userId: store.user.id,
  addData: (formData) => {
    formData.append('guarantorId', guarantorId.value)
  }
})
</script>

<i18n>
{
  "en": {
    "guarantor-residency-situation" : "Your guarantor's housing situation"
  },
  "fr": {
    "guarantor-residency-situation" : "Situation d'hébergement de votre garant"
  }
}
</i18n>
