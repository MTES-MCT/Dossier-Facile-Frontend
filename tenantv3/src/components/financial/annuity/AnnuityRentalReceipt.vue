<template>
  <BackLinkRow :label="t('form.financial.annuity')" :to="ancestor" />
  <BackLinkRow :label="t('rental-income')" :to="grandparent" />
  <BackLinkRow :label="t('have-receipt')" :to="parent" />
  <p class="fr-mb-1w">{{ t('form.financial.enter-monthly-income') }}</p>
  <UploadFilesFinancial category="RENT" step="RENT_RENTAL_RECEIPT">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide"
        ><strong>{{ t('recent-receipt') }}</strong></i18n-t
      >
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
</script>

<i18n>
{
  "en": {
    "rental-income": "You receive rental income",
    "have-receipt": "You have a receipt",
    "please-provide": "Please provide {0}.",
    "recent-receipt": "a receipt less than 3 months old",
  },
  "fr": {
    "rental-income": "Vous touchez des revenus locatifs",
    "have-receipt": "Vous avez une quittance",
    "please-provide": "Veuillez fournir {0}.",
    "recent-receipt": "une quittance de moins de 3 mois",
  }
}
</i18n>
