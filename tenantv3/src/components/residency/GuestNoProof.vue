<template>
  <BackLinkRow
    :label="t('you-hosted')"
    to="/documents-locataire/2"
    @edit="AnalyticsService.editSituation('residency', 'guest')"
  />
  <BackLinkRow
    :label="t('no-accomodation-proof')"
    to="/documents-locataire/2/guest"
    @edit="AnalyticsService.editSituation2('residency', 'guest', 'no-proof')"
  />
  <i18n-t keypath="complete-certificate" tag="p">
    <a
      href="https://www.service-public.fr/simulateur/calcul/AttestationHebergement"
      target="_blank"
      >{{ t('this-certificate') }}</a
    >
  </i18n-t>
  <UploadFiles category="GUEST" step="GUEST_NO_PROOF" />
  <ResidencyFooter previous-page="/documents-locataire/2/guest" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import UploadFiles from './lib/UploadFiles.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "you-hosted": "You are hosted",
    "no-accomodation-proof": "You have no proof of accomodation",
    "complete-certificate": "Please complete {0}, have it signed by your accomodation provider and then insert it below.",
    "this-certificate": "this accomodation certificate"
  },
  "fr": {
    "you-hosted": "Vous êtes hébergé",
    "no-accomodation-proof": "Vous n'avez pas d'attestation d'hébergement",
    "complete-certificate": "Veuillez remplir {0}, la faire signer par votre hébergeur puis la glisser ci-dessous.",
    "this-certificate": "cette attestation d'hébergement"
  }
}
</i18n>
