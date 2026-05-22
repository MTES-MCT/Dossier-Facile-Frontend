<template>
  <BackLinkRow
    :label="t(textKey + '.garantor-tenant')"
    :to="parentRoute"
    @edit="AnalyticsService.editSituation(category, 'tenant')"
  />
  <i18n-t :keypath="textKey + '.please-provide'" tag="p">
    <strong>{{ t('recent-proof') }}</strong>
  </i18n-t>
  <ResidencyAnalysisStep
    :previous-step="residencyState.previousStep"
    sub-category="TENANT"
    :banner-title="t(`${textKey}.analysis-error-title`)"
    :banner-sub-title="t('analysis-error-sub-title')"
    :banner-info-text="t('banner-info-text')"
    :expected-items="expectedDocuments"
    :text-key="textKey === 'couple' ? 'couple-guarantor' : 'guarantor'"
    store-action="saveGuarantorResidency"
  />
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BackLinkRow from '@/components/residency/lib/BackLinkRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import ResidencyAnalysisStep from '@/components/residency/lib/ResidencyAnalysisStep.vue'
import { useResidencyState } from '../residency/residencyState'

const { t } = useI18n()
const parentRoute = useParentRoute()
const residencyState = useResidencyState()
const { category, textKey } = residencyState

const expectedDocuments = computed(() => [
  t('expected-documents.receipt'),
  t('expected-documents.rent-notice'),
  t('expected-documents.utility-bill')
])
</script>

<i18n lang="json">
{
  "en": {
    "recent-proof": "proof of address less than 3 months old",
    "analysis-error-sub-title": "Expected document",
    "banner-info-text": "A document less than 3 months old among the following:",
    "expected-documents": {
      "receipt": "Rent receipt",
      "rent-notice": "Rent due notice",
      "utility-bill": "Utility bill (electricity, gas, water)"
    },
    "tenant": {
      "garantor-tenant": "Your guarantor is a tenant",
      "please-provide": "Please provide {0} in your guarantor's name, such as a telephone, electricity or water bill, or proof of home insurance.",
      "analysis-error-title": "Add a proof of address for your guarantor"
    },
    "couple": {
      "garantor-tenant": "Their guarantor is a tenant",
      "please-provide": "Please provide {0} in their guarantor's name, such as a telephone, electricity or water bill, or proof of home insurance.",
      "analysis-error-title": "Add a proof of address for their guarantor"
    }
  },
  "fr": {
    "recent-proof": "justificatif de domicile de moins de 3 mois",
    "analysis-error-sub-title": "Document attendu",
    "banner-info-text": "Un document de moins de 3 mois parmi les suivants :",
    "expected-documents": {
      "receipt": "Quittance de loyer",
      "rent-notice": "Avis d'échéance",
      "utility-bill": "Facture (électricité, gaz, eau)"
    },
    "tenant": {
      "garantor-tenant": "Votre garant est locataire",
      "please-provide": "Veuillez fournir ici un {0} au nom de votre garant : facture de téléphone, d'électricité, d'eau ou attestation d'assurance habitation par exemple.",
      "analysis-error-title": "Ajoutez un justificatif de domicile pour votre garant"
    },
    "couple": {
      "garantor-tenant": "Son garant est locataire",
      "please-provide": "Veuillez fournir ici un {0} au nom de son garant : facture de téléphone, d'électricité, d'eau ou attestation d'assurance habitation par exemple.",
      "analysis-error-title": "Ajoutez un justificatif de domicile pour son garant"
    }
  }
}
</i18n>
