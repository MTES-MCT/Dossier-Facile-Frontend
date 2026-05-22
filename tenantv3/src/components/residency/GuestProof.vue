<template>
  <BackLinkRow
    :label="t(textKey + '.you-hosted')"
    to="../../2"
    @edit="AnalyticsService.editSituation(category, 'guest')"
  />
  <BackLinkRow
    :label="t(textKey + '.accomodation-proof')"
    to="../guest"
    @edit="AnalyticsService.editSituation2(category, 'guest', 'proof')"
  />
  <i18n-t :keypath="textKey + '.please-provide'" tag="p">
    <strong>{{ t(textKey + '.less-3-months') }}</strong>
  </i18n-t>
  <ResidencyAnalysisStep
    :previous-step="previousStep"
    sub-category="GUEST"
    category-step="GUEST_PROOF"
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
    "analysis-error-title": "Add your proof of accommodation",
    "analysis-error-sub-title": "Expected document",
    "banner-info-text": "Proof of accommodation less than 3 months old",
    "tenant": {
      "you-hosted": "You are hosted",
      "accomodation-proof": "You have a proof of accomodation less than 3 months old",
      "please-provide": "Please provide proof of free accomodation {0}.",
      "less-3-months": "less than 3 months old"
    },
    "couple": {
      "you-hosted": "Your spouse is hosted",
      "accomodation-proof": "Your spouse has a proof of accomodation less than 3 months old",
      "please-provide": "Please provide proof of free accomodation {0} of your spouse.",
      "less-3-months": "less than 3 months old"
    }
  },
  "fr": {
    "analysis-error-title": "Ajoutez votre attestation d'hébergement",
    "analysis-error-sub-title": "Document attendu",
    "banner-info-text": "Attestation d'hébergement de moins de 3 mois",
    "tenant": {
      "you-hosted": "Vous êtes hébergé",
      "accomodation-proof": "Vous avez une attestation d'hébergement de moins de 3 mois",
      "please-provide": "Veuillez fournir votre attestation d'hébergement à titre gratuit {0}.",
      "less-3-months": "de moins de 3 mois"
    },
    "couple": {
      "you-hosted": "Votre conjoint est hébergé",
      "accomodation-proof": "Votre conjoint a une attestation d'hébergement de moins de 3 mois",
      "please-provide": "Veuillez fournir l'attestation d'hébergement à titre gratuit {0} de votre conjoint.",
      "less-3-months": "de moins de 3 mois"
    }
  }
}
</i18n>
