<template>
  <BackLinkRow
    :label="t('you-tenant')"
    to="/documents-locataire/2"
    @edit="AnalyticsService.editSituation('residency', 'tenant')"
  />
  <BackLinkRow
    :label="t('have-proof')"
    to="/documents-locataire/2/tenant"
    @edit="AnalyticsService.editSituation2('residency', 'tenant', 'proof')"
  />
  <i18n-t keypath="please-provide" tag="p">
    <strong>{{ t('less-3-months') }}</strong>
  </i18n-t>

  <div class="fr-alert fr-alert--warning fr-mb-2w">
    <p>{{ t('valid-docs') }}</p>
  </div>
  <UploadFiles category="TENANT" step="TENANT_PROOF" />
  <ResidencyFooter previous-page="/documents-locataire/2/tenant" />
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
    "you-tenant": "You are a tenant",
    "have-proof": "You have proof of good payment of rent",
    "please-provide" : "Please provide proof of good rental payment {0}.",
    "less-3-months": "less than 3 months old",
    "valid-docs": "Only rental payment certificates are valid documents here. All other documents will be refused."
  },
  "fr": {
    "you-tenant": "Vous êtes locataire",
    "have-proof": "Vous avez une attestation de bon paiement des loyers",
    "please-provide" : "Veuillez fournir votre attestation de bon paiement des loyers {0}.",
    "less-3-months": "de moins de 3 mois",
    "valid-docs": "Seules les attestations de bon paiement des loyers sont des documents valides ici. Tout autre document sera refusé."
  }
}
</i18n>
