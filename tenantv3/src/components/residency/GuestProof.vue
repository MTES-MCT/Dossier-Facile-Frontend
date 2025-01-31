<template>
  <BackLinkRow
    :label="t('you-hosted')"
    to="/documents-locataire/2"
    @click="AnalyticsService.editSituation('residency', 'guest')"
  />
  <BackLinkRow
    :label="t('accomodation-proof')"
    to="/documents-locataire/2/guest"
    @click="AnalyticsService.editSituation2('residency', 'guest', 'proof')"
  />
  <i18n-t keypath="please-provide" tag="p">
    <strong>{{ t('less-3-months') }}</strong>
  </i18n-t>
  <UploadFiles category="GUEST" step="GUEST_PROOF" />
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
    "accomodation-proof": "You have a proof of accomodation less than 3 months old",
    "please-provide": "Please provide proof of free accomodation {0}.",
    "less-3-months": "less than 3 months old",
  },
  "fr": {
    "you-hosted": "Vous êtes hébergé",
    "accomodation-proof": "Vous avez une attestation d'hébergement de moins de 3 mois",
    "please-provide": "Veuillez fournir votre attestation d'hébergement à titre gratuit {0}.",
    "less-3-months": "de moins de 3 mois",
  }
}
</i18n>
