<template>
  <BackLinkRow
    :label="t(textKey + '.guarantor-guest')"
    :to="grandparentRoute"
    @edit="AnalyticsService.editSituation(category, 'guest')"
  />
  <BackLinkRow
    :label="t(textKey + '.guarantor-guest-proof')"
    :to="parentRoute"
    @edit="AnalyticsService.editSituation2(category, 'guest', 'proof')"
  />
  <i18n-t :keypath="textKey + '.please-provide'" tag="p">
    <strong>{{ t('recent-proof') }}</strong>
  </i18n-t>
  <ResidencyAnalysisStep
    :previous-step="residencyState.previousStep"
    sub-category="GUEST"
    category-step="GUEST_PROOF"
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
    "recent-proof": "less than 3 months old",
    "analysis-error-sub-title": "Expected document",
    "banner-info-text": "Proof of accommodation less than 3 months old",
    "tenant": {
      "guarantor-guest": "Your guarantor is a lodger",
      "guarantor-guest-proof": "Your guarantor has proof of accommodation less than 3 months old",
      "please-provide": "Please provide proof of free accommodation from your guarantor, {0}.",
      "analysis-error-title": "Add your guarantor's proof of accommodation"
    },
    "couple": {
      "guarantor-guest": "Their guarantor is a lodger",
      "guarantor-guest-proof": "Their guarantor has proof of accommodation less than 3 months old",
      "please-provide": "Please provide proof of free accommodation from their guarantor, {0}.",
      "analysis-error-title": "Add their guarantor's proof of accommodation"
    }
  },
  "fr": {
    "recent-proof": "de moins de 3 mois",
    "analysis-error-sub-title": "Document attendu",
    "banner-info-text": "Attestation d'hébergement de moins de 3 mois",
    "tenant": {
      "guarantor-guest": "Votre garant est hébergé",
      "guarantor-guest-proof": "Votre garant a une attestation d'hébergement de moins de 3 mois",
      "please-provide": "Veuillez fournir l'attestation d'hébergement à titre gratuit {0} de votre garant.",
      "analysis-error-title": "Ajoutez l'attestation d'hébergement de votre garant"
    },
    "couple": {
      "guarantor-guest": "Son garant est hébergé",
      "guarantor-guest-proof": "Son garant a une attestation d'hébergement de moins de 3 mois",
      "please-provide": "Veuillez fournir l'attestation d'hébergement à titre gratuit {0} de son garant.",
      "analysis-error-title": "Ajoutez l'attestation d'hébergement de son garant"
    }
  }
}
</i18n>
