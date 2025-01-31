<template>
  <BackLinkRow
    :label="t('you-hosted')"
    to="/documents-locataire/2"
    @click="AnalyticsService.editSituation('residency', 'guest')"
  />
  <RadioList>
    <RadioListItem to="guest/proof" @click="sendEvent('proof')">{{
      t('accomodation-proof')
    }}</RadioListItem>
    <RadioListItem to="guest/no-proof" @click="sendEvent('no-proof')">{{
      t('no-accomodation-proof')
    }}</RadioListItem>
  </RadioList>
  <ResidencyFooter previous-page="/documents-locataire/2" />
</template>

<script setup lang="ts">
import RadioList from './lib/RadioList.vue'
import BackLinkRow from './lib/BackLinkRow.vue'
import RadioListItem from './lib/RadioListItem.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
const { t } = useI18n()
const sendEvent = (category: string) =>
  AnalyticsService.selectSituation2('residency', 'guest', category)
</script>

<i18n>
{
  "en": {
    "you-hosted": "You are hosted",
    "accomodation-proof": "You have a proof of accomodation less than 3 months old",
    "no-accomodation-proof": "You have no proof of accomodation"
  },
  "fr": {
    "you-hosted": "Vous êtes hébergé",
    "accomodation-proof": "Vous avez une attestation d'hébergement de moins de 3 mois",
    "no-accomodation-proof": "Vous n'avez pas d'attestation d'hébergement"
  }
}
</i18n>
