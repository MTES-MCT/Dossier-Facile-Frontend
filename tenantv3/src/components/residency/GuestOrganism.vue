<template>
  <BackLinkRow :label="t('guest-organism')" to="/documents-locataire/2" />
  <i18n-t keypath="please-provide" tag="p">
    <a href="https://www.service-public.fr/simulateur/calcul/16030" target="_blank">{{
      t('election-certificate')
    }}</a>
  </i18n-t>
  <UploadFiles category="GUEST_ORGANISM" />
  <ResidencyFooter previous-page="/documents-locataire/2" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import UploadFiles from './lib/UploadFiles.vue'
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "guest-organism": "Hosted by an organization",
    "please-provide": "Please provide a {0} less than 3 months old, dated and signed by the accomodation organization (emergency accomodation, placement, ect.).",
    "election-certificate": "certificate of election of domicile"
  },
  "fr": {
    "guest-organism": "Hébergé par un organisme",
    "please-provide": "Veuillez fournir une {0} de moins de 3 mois datée et signée par l’organisme d’hébergement (hébergement d’urgence, placement…)",
    "election-certificate": "attestation d'élection de domicile"
  }
}
</i18n>
