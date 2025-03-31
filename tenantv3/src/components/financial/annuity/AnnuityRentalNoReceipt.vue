<template>
  <BackLinkRow :label="t('form.financial.annuity')" :to="ancestor" />
  <BackLinkRow :label="t('rental-income')" :to="grandparent" />
  <BackLinkRow :label="t('no-receipt')" :to="parent" />
  <p class="fr-mb-1w">{{ t('form.financial.enter-monthly-income') }}</p>
  <UploadFilesFinancial category="RENT" step="RENT_RENTAL_NO_RECEIPT">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide"
        ><strong>{{ t('latest-tax-notice') }}</strong></i18n-t
      >
      <AlertRealisticAmount pclass="bold" class="fr-mb-3w">
        <p>{{ t('for-example') }}</p>
      </AlertRealisticAmount>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'
import AlertRealisticAmount from '../job/AlertRealisticAmount.vue'

const { t } = useI18n()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
</script>

<i18n>
{
  "en": {
    "rental-income": "You receive rental income",
    "no-receipt": "You don't have a receipt",
    "please-provide": "Please provide {0}.",
    "latest-tax-notice": "your latest tax notice 2023-24",
    "for-example": "For example: if the “property income” line on your tax form shows €12,000, your rental income is 12000÷12=1000€."
  },
  "fr": {
    "rental-income": "Vous touchez des revenus locatifs",
    "no-receipt": "Vous n’avez pas de quittance",
    "please-provide": "Veuillez fournir {0}.",
    "latest-tax-notice": "votre dernier avis d’imposition 2023-24",
    "for-example": "Par exemple : si la ligne “revenus fonciers” de votre avis d’imposition indique 12000€, le montant de vos revenus locatifs est de 12000÷12=1000€."
  }
}
</i18n>
