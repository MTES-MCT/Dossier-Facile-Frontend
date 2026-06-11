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
  <ResidencyAnalysisStep
    :previous-step="previousStep"
    sub-category="TENANT"
    category-step="TENANT_PROOF"
    :banner-title="t('analysis-error-title')"
    :banner-sub-title="t('analysis-error-sub-title')"
    :banner-info-text="t('banner-info-text')"
  />
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import { useI18n } from 'vue-i18n'
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyAnalysisStep from './lib/ResidencyAnalysisStep.vue'
import { useResidencyState } from './residencyState'

const { t } = useI18n()
const state = useResidencyState()
const { category, textKey } = state

const previousStep = { name: 'TenantIdentification' }
</script>

<i18n lang="json">
{
  "en": {
    "analysis-error-title": "Add a proof of payment certificate",
    "analysis-error-sub-title": "Expected documents",
    "tenant": {
      "you-tenant": "You are a tenant",
      "have-proof": "You have proof of good payment of rent",
      "please-provide": "Please provide proof of good rental payment {0}.",
      "less-3-months": "less than 3 months old"
    },
    "banner-info-text": "Proof of good payment of rent less than 3 months old",
    "couple": {
      "you-tenant": "Your spouse is a tenant",
      "have-proof": "Your spouse has proof of good payment of rent",
      "please-provide": "Please provide proof of good rental payment {0}.",
      "less-3-months": "less than 3 months old"
    }
  },
  "fr": {
    "analysis-error-title": "Ajoutez une attestation de bon paiement",
    "analysis-error-sub-title": "Documents attendus",
    "tenant": {
      "you-tenant": "Vous êtes locataire",
      "have-proof": "Vous avez une attestation de bon paiement des loyers",
      "please-provide": "Veuillez fournir votre attestation de bon paiement des loyers {0}.",
      "less-3-months": "de moins de 3 mois"
    },
    "banner-info-text": "Attestation de bon paiement des loyers de moins de 3 mois",
    "couple": {
      "you-tenant": "Votre conjoint est locataire",
      "have-proof": "Votre conjoint a une attestation de bon paiement des loyers",
      "please-provide": "Veuillez fournir son attestation de bon paiement des loyers {0}.",
      "less-3-months": "de moins de 3 mois"
    }
  }
}
</i18n>
