<template>
  <BackLinkRow
    :label="t('garantor-tenant')"
    :to="previousPage"
    guarantor
    @edit="AnalyticsService.editSituation('guarantor-residency', 'tenant')"
  />
  <i18n-t keypath="please-provide" tag="p">
    <strong>{{ t('recent-proof') }}</strong>
  </i18n-t>

  <div class="fr-alert fr-alert--info fr-mb-2w">
    <p>{{ t('receipts-info') }}</p>
  </div>
  <UploadFiles category="TENANT" guarantor />
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
    "garantor-tenant": "Your guarantor is a tenant",
    "please-provide" : "Please provide {0} in your guarantor's name, such as a telephone, electricity or water bill, or proof of home insurance.",
    "recent-proof": "proof of address less than 3 months old",
    "receipts-info": "Receipts are not mandatory for a guarantor.",
  },
  "fr": {
    "garantor-tenant": "Votre garant est locataire",
    "please-provide" : "Veuillez fournir ici un {0} au nom de votre garant : facture de téléphone, d'électricité, d'eau ou attestation d'assurance habitation par exemple.",
    "recent-proof": "justificatif de domicile de moins de 3 mois",
    "receipts-info": "Les quittances ne sont pas obligatoires pour un garant.",
  }
}
</i18n>
