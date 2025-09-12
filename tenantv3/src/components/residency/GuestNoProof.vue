<template>
  <BackLinkRow
    :label="t(textKey + '.you-hosted')"
    to="../../2"
    @edit="AnalyticsService.editSituation(category, 'guest')"
  />
  <BackLinkRow
    :label="t(textKey + '.no-accomodation-proof')"
    to="../guest"
    @edit="AnalyticsService.editSituation2(category, 'guest', 'no-proof')"
  />
  <i18n-t :keypath="textKey + '.complete-certificate'" tag="p">
    <a
      href="https://www.service-public.fr/simulateur/calcul/AttestationHebergement"
      :title="`${t('this-certificate')} - ${t('new-window')}`"
      target="_blank"
      >{{ t('this-certificate') }}</a
    >
  </i18n-t>
  <UploadFiles category="GUEST" step="GUEST_NO_PROOF" />
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
const { category, textKey } = useResidencyState()
</script>

<i18n>
{
  "en": {
    "this-certificate": "this accomodation certificate",
    "tenant": {
      "you-hosted": "You are hosted",
      "no-accomodation-proof": "You have no proof of accomodation",
      "complete-certificate": "Please complete {0}, have it signed by your accomodation provider and then insert it below.",
    },
    "couple": {
      "you-hosted": "Your spouse is hosted",
      "no-accomodation-proof": "Your spouse has no proof of accomodation",
      "complete-certificate": "Please tell your spouse to complete {0}, have it signed by his/her accomodation provider and then insert it below.",
    }
  },
  "fr": {
    "this-certificate": "cette attestation d'hébergement",
    "tenant": {
      "you-hosted": "Vous êtes hébergé",
      "no-accomodation-proof": "Vous n'avez pas d'attestation d'hébergement",
      "complete-certificate": "Veuillez remplir {0}, la faire signer par votre hébergeur puis la glisser ci-dessous.",
    },
    "couple": {
      "you-hosted": "Votre conjoint est hébergé",
      "no-accomodation-proof": "Votre conjoint n'a pas d'attestation d'hébergement",
      "complete-certificate": "Veuillez indiquer à votre conjoint de remplir {0}, la faire signer par son hébergeur puis la glisser ci-dessous.",
    }
  }
}
</i18n>
