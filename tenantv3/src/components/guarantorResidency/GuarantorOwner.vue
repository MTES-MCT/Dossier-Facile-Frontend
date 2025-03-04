<template>
  <BackLinkRow
    :label="t(textKey + '.garantor-owner')"
    :to="parentRoute"
    @edit="AnalyticsService.editSituation(category, 'owner')"
  />
  <i18n-t keypath="please-provide" tag="p" class="fr-mb-0">
    <strong>{{ t('your-choice') }}</strong>
  </i18n-t>
  <ul>
    <i18n-t :keypath="textKey + '.choice-1'" tag="li">
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
import GuarantorResidencyFooter from './GuarantorResidencyFooter.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useParentRoute } from './useParentRoute'
import { useResidencyState } from '../residency/residencyState'
const { t } = useI18n()
const parentRoute = useParentRoute()
const { category, textKey } = useResidencyState()
</script>

<i18n>
{
  "en": {
    "please-provide" : "Please add one of the following documents here:",
    "your-choice": "",
    "tax-notice": "2024 property tax notice",
    "recent-proof": "or proof of address less than 3 months old",
    "choice-2": "{0} in their name, such as a telephone, electricity or water bill, or proof of home insurance.",
    "tenant": {
      "garantor-owner": "Your guarantor is an owner",
      "choice-1": "your guarantor's {0}",
    },
    "couple": {
      "garantor-owner": "Their guarantor is an owner",
      "choice-1": "their guarantor's {0}",
    }
  },
  "fr": {
    "please-provide" : "Merci d'ajouter ici l'un des documents suivants, {0} :",
    "your-choice": "au choix",
    "tax-notice": "l'avis de taxe foncière 2024",
    "recent-proof": "ou un justificatif de domicile de moins de 3 mois",
    "choice-2": "{0} à son nom : facture de téléphone, d'électricité, d'eau ou attestation d'assurance habitation par exemple",
    "tenant": {
      "garantor-owner": "Votre garant est propriétaire",
      "choice-1": "{0} de votre garant",
    },
    "couple": {
      "garantor-owner": "Son garant est propriétaire",
      "choice-1": "{0} de son garant",
    }
  }
}
</i18n>
