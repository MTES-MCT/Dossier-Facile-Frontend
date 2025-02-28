<template>
  <BackLinkRow
    :label="t(textKey + '.you-hosted')"
    to="../2"
    @edit="AnalyticsService.editSituation('residency', 'guest')"
  />
  <RadioList>
    <RadioListItem to="guest/proof" @click="sendEvent('proof')">{{
      t(textKey + '.accomodation-proof')
    }}</RadioListItem>
    <RadioListItem to="guest/no-proof" @click="sendEvent('no-proof')">{{
      t(textKey + '.no-accomodation-proof')
    }}</RadioListItem>
  </RadioList>
  <ResidencyFooter />
</template>

<script setup lang="ts">
import RadioList from './lib/RadioList.vue'
import BackLinkRow from './lib/BackLinkRow.vue'
import RadioListItem from './lib/RadioListItem.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useResidencyState } from './residencyState'
const { t } = useI18n()
const { textKey } = useResidencyState()
const sendEvent = (category: string) =>
  AnalyticsService.selectSituation2('residency', 'guest', category)
</script>

<i18n>
{
  "en": {
    "tenant": {
      "you-hosted": "You are hosted",
      "accomodation-proof": "You have a proof of accomodation less than 3 months old",
      "no-accomodation-proof": "You have no proof of accomodation"
    },
    "couple": {
      "you-hosted": "Your spouse is hosted",
      "accomodation-proof": "Your spouse has a proof of accomodation less than 3 months old",
      "no-accomodation-proof": "Your spouse doesn't have a proof of accomodation"
    }
  },
  "fr": {
    "tenant": {
      "you-hosted": "Vous êtes hébergé",
      "accomodation-proof": "Vous avez une attestation d'hébergement de moins de 3 mois",
      "no-accomodation-proof": "Vous n'avez pas d'attestation d'hébergement"
    },
    "couple": {
      "you-hosted": "Votre conjoint est hébergé",
      "accomodation-proof": "Votre conjoint a une attestation d'hébergement de moins de 3 mois",
      "no-accomodation-proof": "Votre conjoint n'a pas d'attestation d'hébergement"
    }
  }
}
</i18n>
