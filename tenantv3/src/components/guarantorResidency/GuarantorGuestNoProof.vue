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
      target="_blank"
      >{{ t('this-proof') }}</a
    >
  </i18n-t>

  <UploadFiles category="GUEST" step="GUEST_NO_PROOF" guarantor />
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
const { category, textKey } = useResidencyState()
</script>

<i18n>
{
  "en": {
    "this-proof": "this accommodation certificate",
    "tenant": {
      "guarantor-guest": "Your guarantor is a lodger",
      "guarantor-guest-no-proof": "Your guarantor has no proof of accommodation",
      "please-provide" : "Please ask your guarantor to fill in {0}, have it signed by his or her accommodation provider and then insert it below.",
    },
    "couple": {
      "guarantor-guest": "Their guarantor is a lodger",
      "guarantor-guest-no-proof": "Their guarantor has no proof of accommodation",
      "please-provide" : "Please ask their guarantor to fill in {0}, have it signed by his or her accommodation provider and then insert it below.",
    }
  },
  "fr": {
    "this-proof": "cette attestation d'hébergement",
    "tenant": {
      "guarantor-guest": "Votre garant est hébergé",
      "guarantor-guest-no-proof": "Votre garant n'a pas d'attestation d'hébergement",
      "please-provide" : "Veuillez indiquer à votre garant de remplir {0}, la faire signer par son hébergeur puis la glisser ci-dessous.",
    },
    "couple": {
      "guarantor-guest": "Son garant est hébergé",
      "guarantor-guest-no-proof": "Son garant n'a pas d'attestation d'hébergement",
      "please-provide" : "Veuillez indiquer à son garant de remplir {0}, la faire signer par son hébergeur puis la glisser ci-dessous.",
    }
  }
}
</i18n>
