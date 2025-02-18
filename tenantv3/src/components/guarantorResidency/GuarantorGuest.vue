<template>
  <BackLinkRow
    :label="t('guarantor-residency.guest')"
    :to="previousPage"
    guarantor
    @edit="AnalyticsService.editSituation('guarantor-residency', 'guest')"
  />
  <RadioList>
    <RadioListItem to="guest/proof" @click="sendEvent('proof')">{{
      t('guarantor-residency.proof')
    }}</RadioListItem>
    <RadioListItem to="guest/no-proof" @click="sendEvent('no-proof')">{{
      t('guarantor-residency.no-proof')
    }}</RadioListItem>
  </RadioList>
  <GuarantorResidencyFooter />
</template>

<script setup lang="ts">
import RadioList from '@/components/residency/lib/RadioList.vue'
import RadioListItem from '@/components/residency/lib/RadioListItem.vue'
import BackLinkRow from '@/components/residency/lib/BackLinkRow.vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useGuarantorId } from './useGuarantorId'
import { computed } from 'vue'
import GuarantorResidencyFooter from './GuarantorResidencyFooter.vue'

const { t } = useI18n()
const guarantorId = useGuarantorId()
const previousPage = computed(() => `/info-garant/2/${guarantorId.value}`)

const sendEvent = (subcategory: string) =>
  AnalyticsService.selectSituation2('guarantor-residency', 'guest', subcategory)
</script>

<i18n>
{
  "en": {
    "guarantor-residency": {
      "guest": "Your guarantor is a lodger",
      "proof": "Your guarantor has proof of accomodation less than 3 months old",
      "no-proof": "Your guarantor has no proof of accomodation"
    }
  },
  "fr": {
    "guarantor-residency": {
      "guest": "Votre garant est hébergé",
      "proof": "Votre garant a une attestation d'hébergement de moins de 3 mois",
      "no-proof": "Votre garant n'a pas d'attestation d'hébergement"
    }
  }
}
</i18n>
