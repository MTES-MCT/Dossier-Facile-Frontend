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
      <strong>{{ t('tax-notice', [taxYear]) }}</strong>
    </i18n-t>
    <i18n-t keypath="choice-2" tag="li">
      <strong>{{ t('recent-proof') }}</strong>
    </i18n-t>
  </ul>
  <ResidencyAnalysisStep
    :previous-step="residencyState.previousStep"
    sub-category="OWNER"
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
import ResidencyAnalysisStep from '@/components/residency/lib/ResidencyAnalysisStep.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useResidencyState } from '../residency/residencyState'
import { taxYear } from '@/components/residency/lib/taxYear'

const { t } = useI18n()
const parentRoute = useParentRoute()
const residencyState = useResidencyState()
const { category, textKey } = residencyState

const expectedDocuments = computed(() => [
  t('expected-documents.tax-notice', [taxYear]),
  t('expected-documents.utility-bill'),
  t('expected-documents.home-insurance')
])
</script>

<i18n lang="json">
{
  "en": {
    "analysis-error-sub-title": "Expected document",
    "banner-info-text": "A document among the following:",
    "expected-documents": {
      "tax-notice": "Property tax {0} (minimum 2 pages)",
      "utility-bill": "Utility bill (electricity, gas, water) less than 3 months old",
      "home-insurance": "Home insurance certificate less than 3 months old"
    },
    "please-provide": "Please add one of the following documents here:",
    "your-choice": "",
    "tax-notice": "{0} property tax notice",
    "recent-proof": "or proof of address less than 3 months old",
    "choice-2": "{0} in their name, such as a telephone, electricity or water bill, or proof of home insurance.",
    "tenant": {
      "garantor-owner": "Your guarantor is an owner",
      "choice-1": "your guarantor's {0}",
      "analysis-error-title": "Add your guarantor's proof of address"
    },
    "couple": {
      "garantor-owner": "Their guarantor is an owner",
      "choice-1": "their guarantor's {0}",
      "analysis-error-title": "Add their guarantor's proof of address"
    }
  },
  "fr": {
    "analysis-error-sub-title": "Document attendu",
    "banner-info-text": "Un document parmi les suivants :",
    "expected-documents": {
      "tax-notice": "Taxe foncière {0} (2 pages minimum)",
      "utility-bill": "Facture (électricité, gaz, eau) de moins de 3 mois",
      "home-insurance": "Attestation d'assurance habitation de moins de 3 mois"
    },
    "please-provide": "Merci d'ajouter ici l'un des documents suivants, {0} :",
    "your-choice": "au choix",
    "tax-notice": "l'avis de taxe foncière {0}",
    "recent-proof": "ou un justificatif de domicile de moins de 3 mois",
    "choice-2": "{0} à son nom : facture de téléphone, d'électricité, d'eau ou attestation d'assurance habitation par exemple",
    "tenant": {
      "garantor-owner": "Votre garant est propriétaire",
      "choice-1": "{0} de votre garant",
      "analysis-error-title": "Ajoutez les justificatifs de domicile de votre garant"
    },
    "couple": {
      "garantor-owner": "Son garant est propriétaire",
      "choice-1": "{0} de son garant",
      "analysis-error-title": "Ajoutez les justificatifs de domicile de son garant"
    }
  }
}
</i18n>
