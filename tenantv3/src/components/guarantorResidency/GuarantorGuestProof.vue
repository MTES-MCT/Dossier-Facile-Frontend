<template>
  <BackLinkRow
    :label="t('guarantor-guest')"
    :to="grandparentRoute"
    guarantor
    @edit="AnalyticsService.editSituation('guarantor-residency', 'guest')"
  />
  <BackLinkRow
    :label="t('guarantor-guest-proof')"
    :to="parentRoute"
    guarantor
    @edit="AnalyticsService.editSituation2('guarantor-residency', 'guest', 'proof')"
  />
  <i18n-t keypath="please-provide" tag="p">
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
const { t } = useI18n()
const parentRoute = useParentRoute()
const grandparentRoute = useParentRoute(2)
</script>

<i18n>
{
  "en": {
    "guarantor-guest": "Your guarantor is a lodger",
    "guarantor-guest-proof": "Your guarantor has proof of accommodation less than 3 months old",
    "please-provide": "Please provide proof of free accommodation from your guarantor, {0}.",
    "recent-proof": "less than 3 months old"
  },
  "fr": {
    "guarantor-guest": "Votre garant est hébergé",
    "guarantor-guest-proof": "Votre garant a une attestation d'hébergement de moins de 3 mois",
    "please-provide": "Veuillez fournir l'attestation d'hébergement à titre gratuit {0} de votre garant.",
    "recent-proof": "de moins de 3 mois"
  }
}
</i18n>
