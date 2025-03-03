<template>
  <BackLinkRow
    :label="t(textKey + '.garantor-tenant')"
    :to="parentRoute"
    guarantor
    @edit="AnalyticsService.editSituation('guarantor-residency', 'tenant')"
  />
  <i18n-t :keypath="textKey + '.please-provide'" tag="p">
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
import GuarantorResidencyFooter from './GuarantorResidencyFooter.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useParentRoute } from './useParentRoute'
import { useResidencyState } from '../residency/residencyState'
const { t } = useI18n()
const parentRoute = useParentRoute()
const { textKey } = useResidencyState()
</script>

<i18n>
{
  "en": {
    "recent-proof": "proof of address less than 3 months old",
    "receipts-info": "Receipts are not mandatory for a guarantor.",
    "tenant": {
      "garantor-tenant": "Your guarantor is a tenant",
      "please-provide" : "Please provide {0} in your guarantor's name, such as a telephone, electricity or water bill, or proof of home insurance.",
    },
    "couple": {
      "garantor-tenant": "Their guarantor is a tenant",
      "please-provide" : "Please provide {0} in their guarantor's name, such as a telephone, electricity or water bill, or proof of home insurance.",
    }
  },
  "fr": {
    "recent-proof": "justificatif de domicile de moins de 3 mois",
    "receipts-info": "Les quittances ne sont pas obligatoires pour un garant.",
    "tenant": {
      "garantor-tenant": "Votre garant est locataire",
      "please-provide" : "Veuillez fournir ici un {0} au nom de votre garant : facture de téléphone, d'électricité, d'eau ou attestation d'assurance habitation par exemple.",
    },
    "couple": {
      "garantor-tenant": "Son garant est locataire",
      "please-provide" : "Veuillez fournir ici un {0} au nom de son garant : facture de téléphone, d'électricité, d'eau ou attestation d'assurance habitation par exemple.",
    }
  }
}
</i18n>
