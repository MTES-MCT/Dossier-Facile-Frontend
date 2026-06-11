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
  <ResidencyAnalysisStep
    :previous-step="previousStep"
    sub-category="GUEST"
    category-step="GUEST_NO_PROOF"
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
const { category, textKey, previousStep } = state
</script>

<i18n lang="json">
{
  "en": {
    "analysis-error-title": "Add your proof of accommodation",
    "analysis-error-sub-title": "Expected document",
    "banner-info-text": "Proof of accommodation less than 3 months old",
    "this-certificate": "this accomodation certificate",
    "tenant": {
      "you-hosted": "You are hosted",
      "no-accomodation-proof": "You have no proof of accomodation",
      "complete-certificate": "Please complete {0}, have it signed by your accomodation provider and then insert it below."
    },
    "couple": {
      "you-hosted": "Your spouse is hosted",
      "no-accomodation-proof": "Your spouse has no proof of accomodation",
      "complete-certificate": "Please tell your spouse to complete {0}, have it signed by his/her accomodation provider and then insert it below."
    }
  },
  "fr": {
    "analysis-error-title": "Ajoutez votre attestation d'hébergement",
    "analysis-error-sub-title": "Document attendu",
    "banner-info-text": "Attestation d'hébergement de moins de 3 mois",
    "this-certificate": "cette attestation d'hébergement",
    "tenant": {
      "you-hosted": "Vous êtes hébergé",
      "no-accomodation-proof": "Vous n'avez pas d'attestation d'hébergement",
      "complete-certificate": "Veuillez remplir {0}, la faire signer par votre hébergeur puis la glisser ci-dessous."
    },
    "couple": {
      "you-hosted": "Votre conjoint est hébergé",
      "no-accomodation-proof": "Votre conjoint n'a pas d'attestation d'hébergement",
      "complete-certificate": "Veuillez indiquer à votre conjoint de remplir {0}, la faire signer par son hébergeur puis la glisser ci-dessous."
    }
  }
}
</i18n>
