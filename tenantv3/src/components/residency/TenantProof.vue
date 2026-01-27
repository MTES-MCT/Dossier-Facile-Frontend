<template>
  <BackLinkRow
    :label="t(textKey + '.you-tenant')"
    to="../../2"
    @edit="AnalyticsService.editSituation(category, 'tenant')"
  />
  <BackLinkRow
    :label="t(textKey + '.have-proof')"
    to="../tenant"
    @edit="AnalyticsService.editSituation2(category, 'tenant', 'proof')"
  />
  <i18n-t :keypath="textKey + '.please-provide'" tag="p">
    <strong>{{ t(textKey + '.less-3-months') }}</strong>
  </i18n-t>

  <DsfrAlert type="warning" small :description="t(textKey + '.valid-docs')" />
  <UploadFiles category="TENANT" step="TENANT_PROOF" />
  <ResidencyFooter />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import UploadFiles from './lib/UploadFiles.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useResidencyState } from './residencyState'
import { DsfrAlert } from '@gouvminint/vue-dsfr'
const { t } = useI18n()
const { category, textKey } = useResidencyState()
</script>

<i18n>
{
  "en": {
    "tenant": {
      "you-tenant": "You are a tenant",
      "have-proof": "You have proof of good payment of rent",
      "please-provide" : "Please provide proof of good rental payment {0}.",
      "less-3-months": "less than 3 months old",
      "valid-docs": "Only rental payment certificates are valid documents here. All other documents will be refused."
    },
    "couple": {
      "you-tenant": "Your spouse is a tenant",
      "have-proof": "Your spouse has proof of good payment of rent",
      "please-provide" : "Please provide proof of good rental payment {0}.",
      "less-3-months": "less than 3 months old",
      "valid-docs": "Only rental payment certificates are valid documents here. All other documents will be refused."
    }
  },
  "fr": {
    "tenant": {
      "you-tenant": "Vous êtes locataire",
      "have-proof": "Vous avez une attestation de bon paiement des loyers",
      "please-provide" : "Veuillez fournir votre attestation de bon paiement des loyers {0}.",
      "less-3-months": "de moins de 3 mois",
      "valid-docs": "Seules les attestations de bon paiement des loyers sont des documents valides ici. Tout autre document sera refusé."
    },
    "couple": {
      "you-tenant": "Votre conjoint est locataire",
      "have-proof": "Votre conjoint a une attestation de bon paiement des loyers",
      "please-provide" : "Veuillez fournir son attestation de bon paiement des loyers {0}.",
      "less-3-months": "de moins de 3 mois",
      "valid-docs": "Seules les attestations de bon paiement des loyers sont des documents valides ici. Tout autre document sera refusé."
    }
  }
}
</i18n>
