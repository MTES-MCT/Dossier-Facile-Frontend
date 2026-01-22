<template>
  <BackLinkRow
    :label="t(textKey + '.you-hosted')"
    to="../2"
    @edit="AnalyticsService.editSituation(category, 'guest')"
  />
  <RadioList :list-items="optionLinks" @analytics="sendEvent" />
  <ResidencyFooter />
</template>

<script setup lang="ts">
import RadioList, { type optionLink } from '@/components/common/RadioList.vue'
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useResidencyState } from './residencyState'
import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const { category, textKey } = useResidencyState()

const route = useRoute()
const here = computed(() => route.path)

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation2(category, 'guest', subCategory)

const optionLinks: ComputedRef<optionLink[]> = computed(() => [
  {
    to: `${here.value}/proof`,
    title: t(textKey + '.accomodation-proof'),
    event: 'proof'
  },
  {
    to: `${here.value}/no-proof`,
    title: t(textKey + '.no-accomodation-proof'),
    event: 'no-proof'
  }
])
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
