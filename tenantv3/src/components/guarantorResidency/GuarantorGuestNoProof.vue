<template>
  <BackLinkRow
    :label="t('guarantor-guest')"
    :to="'/info-garant/2/' + guarantorId"
    guarantor
    @edit="AnalyticsService.editSituation('guarantor-residency', 'guest')"
  />
  <BackLinkRow
    :label="t('guarantor-guest-no-proof')"
    :to="previousPage"
    guarantor
    @edit="AnalyticsService.editSituation2('guarantor-residency', 'guest', 'no-proof')"
  />
  <i18n-t keypath="please-provide" tag="p">
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
import { useGuarantorId } from './useGuarantorId'
import GuarantorResidencyFooter from './GuarantorResidencyFooter.vue'
import { computed } from 'vue'
import { AnalyticsService } from '@/services/AnalyticsService'
const { t } = useI18n()
const guarantorId = useGuarantorId()
const previousPage = computed(() => `/info-garant/2/${guarantorId.value}/guest`)
</script>

<i18n>
{
  "en": {
    "guarantor-guest": "Your guarantor is a lodger",
    "guarantor-guest-no-proof": "Your guarantor has no proof of accommodation",
    "please-provide" : "Please ask your guarantor to fill in {0}, have it signed by his or her accommodation provider and then insert it below.",
    "this-proof": "this accommodation certificate"
  },
  "fr": {
    "guarantor-guest": "Votre garant est hébergé",
    "guarantor-guest-no-proof": "Votre garant n'a pas d'attestation d'hébergement",
    "please-provide" : "Veuillez indiquer à votre garant de remplir {0}, la faire signer par son hébergeur puis la glisser ci-dessous.",
    "this-proof": "cette attestation d'hébergement"
  }
}
</i18n>
