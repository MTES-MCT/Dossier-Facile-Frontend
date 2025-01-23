<template>
  <BackLinkRow :label="t('short-term-rental')" to="/documents-locataire/2" />
  <i18n-t keypath="please-provide" tag="p">
    <strong>{{ t('paid-invoices') }}</strong>
  </i18n-t>
  <UploadFiles category="SHORT_TERM_RENTAL" />
  <ResidencyFooter />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BackLinkRow from './lib/BackLinkRow.vue'
import UploadFiles from './lib/UploadFiles.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "short-term-rental": "Airbnb rentals, hotels, campsites",
    "please-provide": "Please provide {0} for the last 3 months.",
    "paid-invoices": "paid invoices"
  },
  "fr": {
    "short-term-rental": "En location de type airbnb, à l'hôtel, au camping",
    "please-provide": "Veuillez fournir {0} de ces 3 derniers mois.",
    "paid-invoices": "les factures réglées"
  }
}
</i18n>
