<template>
  <BackLinkRow
    :label="t('garantor-owner')"
    :to="previousPage"
    guarantor
    @edit="AnalyticsService.editSituation('guarantor-residency', 'owner')"
  />
  <i18n-t keypath="please-provide" tag="p" class="fr-mb-0">
    <strong>{{ t('your-choice') }}</strong>
  </i18n-t>
  <ul>
    <i18n-t keypath="choice-1" tag="li">
      <strong>{{ t('tax-notice') }}</strong>
    </i18n-t>
    <i18n-t keypath="choice-2" tag="li">
      <strong>{{ t('recent-proof') }}</strong>
    </i18n-t>
  </ul>

  <UploadFiles category="OWNER" guarantor />
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
const previousPage = computed(() => `/info-garant/2/${guarantorId.value}`)
</script>

<i18n>
{
  "en": {
    "garantor-owner": "Your guarantor is an owner",
    "please-provide" : "Please add one of the following documents here:",
    "your-choice": "",
    "choice-1": "your guarantor's {0}",
    "tax-notice": "2024 property tax notice",
    "choice-2": "{0} in your name, such as a telephone, electricity or water bill, or proof of home insurance.",
    "recent-proof": "or proof of address less than 3 months old",
  },
  "fr": {
    "garantor-owner": "Votre garant est propriétaire",
    "please-provide" : "Merci d'ajouter ici l'un des documents suivants, {0} :",
    "your-choice": "au choix",
    "choice-1": "{0} de votre garant",
    "tax-notice": "l'avis de taxe foncière 2024",
    "choice-2": "{0} à son nom : facture de téléphone, d'électricité, d'eau ou attestation d'assurance habitation par exemple",
    "recent-proof": "ou un justificatif de domicile de moins de 3 mois",
  }
}
</i18n>
