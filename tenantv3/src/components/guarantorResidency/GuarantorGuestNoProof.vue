<template>
  <BackLinkRow
    :label="t(textKey + '.guarantor-guest')"
    :to="grandparentRoute"
    @edit="AnalyticsService.editSituation(category, 'guest')"
  />
  <BackLinkRow
    :label="t(textKey + '.guarantor-guest-no-proof')"
    :to="parentRoute"
    @edit="AnalyticsService.editSituation2(category, 'guest', 'no-proof')"
  />
  <i18n-t :keypath="textKey + '.please-provide'" tag="p">
    <a
      href="https://www.service-public.fr/simulateur/calcul/AttestationHebergement"
      :title="`${t('this-proof')} - ${t('new-window')}`"
      target="_blank"
      >{{ t('this-proof') }}</a
    >
  </i18n-t>
  <ResidencyAnalysisStep
    :previous-step="residencyState.previousStep"
    sub-category="GUEST"
    category-step="GUEST_NO_PROOF"
    :banner-title="t(`${textKey}.analysis-error-title`)"
    :banner-sub-title="t('analysis-error-sub-title')"
    :banner-info-text="t('banner-info-text')"
    :text-key="textKey === 'couple' ? 'couple-guarantor' : 'guarantor'"
    store-action="saveGuarantorResidency"
  />
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import { useI18n } from 'vue-i18n'
import BackLinkRow from '@/components/residency/lib/BackLinkRow.vue'
import ResidencyAnalysisStep from '@/components/residency/lib/ResidencyAnalysisStep.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useResidencyState } from '../residency/residencyState'

const { t } = useI18n()
const parentRoute = useParentRoute()
const grandparentRoute = useParentRoute(2)
const residencyState = useResidencyState()
const { category, textKey } = residencyState
</script>

<i18n lang="json">
{
  "en": {
    "analysis-error-sub-title": "Expected document",
    "banner-info-text": "Proof of accommodation less than 3 months old",
    "this-proof": "this accommodation certificate",
    "tenant": {
      "guarantor-guest": "Your guarantor is a lodger",
      "guarantor-guest-no-proof": "Your guarantor has no proof of accommodation",
      "please-provide": "Please ask your guarantor to fill in {0}, have it signed by his or her accommodation provider and then insert it below.",
      "analysis-error-title": "Add your guarantor's proof of accommodation"
    },
    "couple": {
      "guarantor-guest": "Their guarantor is a lodger",
      "guarantor-guest-no-proof": "Their guarantor has no proof of accommodation",
      "please-provide": "Please ask their guarantor to fill in {0}, have it signed by his or her accommodation provider and then insert it below.",
      "analysis-error-title": "Add their guarantor's proof of accommodation"
    }
  },
  "fr": {
    "analysis-error-sub-title": "Document attendu",
    "banner-info-text": "Attestation d'hébergement de moins de 3 mois",
    "this-proof": "cette attestation d'hébergement",
    "tenant": {
      "guarantor-guest": "Votre garant est hébergé",
      "guarantor-guest-no-proof": "Votre garant n'a pas d'attestation d'hébergement",
      "please-provide": "Veuillez indiquer à votre garant de remplir {0}, la faire signer par son hébergeur puis la glisser ci-dessous.",
      "analysis-error-title": "Ajoutez l'attestation d'hébergement de votre garant"
    },
    "couple": {
      "guarantor-guest": "Son garant est hébergé",
      "guarantor-guest-no-proof": "Son garant n'a pas d'attestation d'hébergement",
      "please-provide": "Veuillez indiquer à son garant de remplir {0}, la faire signer par son hébergeur puis la glisser ci-dessous.",
      "analysis-error-title": "Ajoutez l'attestation d'hébergement de son garant"
    }
  }
}
</i18n>
