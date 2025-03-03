<template>
  <BackLinkRow
    :label="t(textKey + '.guarantor-guest')"
    :to="grandparentRoute"
    guarantor
    @edit="AnalyticsService.editSituation('guarantor-residency', 'guest')"
  />
  <BackLinkRow
    :label="t(textKey + '.guarantor-guest-proof')"
    :to="parentRoute"
    guarantor
    @edit="AnalyticsService.editSituation2('guarantor-residency', 'guest', 'proof')"
  />
  <i18n-t :keypath="textKey + '.please-provide'" tag="p">
    <strong>{{ t('recent-proof') }}</strong>
  </i18n-t>

  <UploadFiles category="GUEST" step="GUEST_PROOF" guarantor />
  <GuarantorResidencyFooter />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UploadFiles from '@/components/residency/lib/UploadFiles.vue'
import BackLinkRow from '@/components/residency/lib/BackLinkRow.vue'
import GuarantorResidencyFooter from './GuarantorResidencyFooter.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useParentRoute } from './useParentRoute'
import { useResidencyState } from '../residency/residencyState'
const { t } = useI18n()
const parentRoute = useParentRoute()
const grandparentRoute = useParentRoute(2)
const { textKey } = useResidencyState()
</script>

<i18n>
{
  "en": {
    "recent-proof": "less than 3 months old",
    "tenant": {
      "guarantor-guest": "Your guarantor is a lodger",
      "guarantor-guest-proof": "Your guarantor has proof of accommodation less than 3 months old",
      "please-provide": "Please provide proof of free accommodation from your guarantor, {0}.",
    },
    "couple": {
      "guarantor-guest": "Your guarantor is a lodger",
      "guarantor-guest-proof": "Your guarantor has proof of accommodation less than 3 months old",
      "please-provide": "Please provide proof of free accommodation from your guarantor, {0}.",
    }
  },
  "fr": {
    "recent-proof": "de moins de 3 mois",
    "tenant": {
      "guarantor-guest": "Votre garant est hébergé",
      "guarantor-guest-proof": "Votre garant a une attestation d'hébergement de moins de 3 mois",
      "please-provide": "Veuillez fournir l'attestation d'hébergement à titre gratuit {0} de votre garant.",
    },
    "couple": {
      "guarantor-guest": "Son garant est hébergé",
      "guarantor-guest-proof": "Son garant a une attestation d'hébergement de moins de 3 mois",
      "please-provide": "Veuillez fournir l'attestation d'hébergement à titre gratuit {0} de son garant.",
    }
  }
}
</i18n>
