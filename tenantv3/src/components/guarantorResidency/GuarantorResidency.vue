<template>
  <NakedCard class="fr-p-md-5w">
    <h6>{{ t('guarantor-residency-situation') }}</h6>
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

const { t } = useI18n()
const store = useTenantStore()
const guarantorId = useGuarantorId()

provide(residencyKey, {
  category: 'guarantor-residency',
  textKey: 'tenant',
  previousStep: `/info-garant/1/${guarantorId.value}`,
  nextStep: `/info-garant/3/${guarantorId.value}`,
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
