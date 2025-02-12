<template>
  <BackLinkRow
    :label="t('guarantor-other')"
    :to="previousPage"
    guarantor
    @edit="AnalyticsService.editSituation('guarantor-residency', 'other')"
  />
  <i18n-t keypath="please-provide" tag="p">
    <strong>{{ t('recent-proof') }}</strong>
  </i18n-t>
  <i18n-t keypath="advice" tag="p">
    <a href="https://www.service-public.fr/simulateur/calcul/AttestationHebergement" target="_blank"
      >service-public.fr</a
    >
  </i18n-t>

  <UploadFiles category="OTHER_RESIDENCY" guarantor />
  <GuarantorResidencyFooter :previous-page="previousPage" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UploadFiles from '@/components/residency/lib/UploadFiles.vue'
import BackLinkRow from '@/components/residency/lib/BackLinkRow.vue'
import { useGuarantorId } from './useGuarantorId'
import { computed } from 'vue'
import GuarantorResidencyFooter from './GuarantorResidencyFooter.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
const { t } = useI18n()
const guarantorId = useGuarantorId()
const previousPage = computed(() => `/info-garant/2/${guarantorId.value}`)
</script>

<i18n>
{
  "en": {
    "guarantor-other": "Other",
    "please-provide" : "Please provide {0} attesting to your guarantor's housing situation.",
    "recent-proof": "a document less than 3 months old",
    "advice": "If you don't have one, please add an affidavit explaining your situation. You can use the model available on the {0} website."
  },
  "fr": {
    "guarantor-other": "Autre",
    "please-provide" : "Veuillez fournir {0} attestant la situation d'hébergement de votre garant.",
    "recent-proof": "un document de moins de 3 mois",
    "advice": "Si vous n'en avez pas, veuillez ajouter une attestation sur l’honneur expliquant sa situation. Vous pouvez utiliser le modèle disponible sur le site {0}"
  }
}
</i18n>
