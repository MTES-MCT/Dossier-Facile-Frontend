<template>
  <BackLinkRow
    :label="t(textKey + '.you-hosted')"
    to="../../2"
    @edit="AnalyticsService.editSituation('residency', 'guest')"
  />
  <BackLinkRow
    :label="t(textKey + '.accomodation-proof')"
    to="../guest"
    @edit="AnalyticsService.editSituation2('residency', 'guest', 'proof')"
  />
  <i18n-t :keypath="textKey + '.please-provide'" tag="p">
    <strong>{{ t(textKey + '.less-3-months') }}</strong>
  </i18n-t>
  <UploadFiles category="GUEST" step="GUEST_PROOF" />
  <ResidencyFooter />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import UploadFiles from './lib/UploadFiles.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useResidencyState } from './residencyState'
const { t } = useI18n()
const { textKey } = useResidencyState()
</script>

<i18n>
{
  "en": {
    "tenant": {
      "you-hosted": "You are hosted",
      "accomodation-proof": "You have a proof of accomodation less than 3 months old",
      "please-provide": "Please provide proof of free accomodation {0}.",
      "less-3-months": "less than 3 months old",
    },
    "couple": {
      "you-hosted": "Your spouse is hosted",
      "accomodation-proof": "Your spouse has a proof of accomodation less than 3 months old",
      "please-provide": "Please provide proof of free accomodation {0} of your spouse.",
      "less-3-months": "less than 3 months old",
    }
  },
  "fr": {
    "tenant": {
      "you-hosted": "Vous êtes hébergé",
      "accomodation-proof": "Vous avez une attestation d'hébergement de moins de 3 mois",
      "please-provide": "Veuillez fournir votre attestation d'hébergement à titre gratuit {0}.",
      "less-3-months": "de moins de 3 mois",
    },
    "couple": {
      "you-hosted": "Votre conjoint est hébergé",
      "accomodation-proof": "Votre conjoint a une attestation d'hébergement de moins de 3 mois",
      "please-provide": "Veuillez fournir l'attestation d'hébergement à titre gratuit {0} de votre conjoint.",
      "less-3-months": "de moins de 3 mois",
    }
  }
}
</i18n>
