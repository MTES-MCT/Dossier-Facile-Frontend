<template>
  <BackLinkRow :label="t('form.financial.annuity')" :to="ancestor" category="rente" />
  <BackLinkRow
    :label="t('rental-income.' + textKey)"
    :to="grandparent"
    category="rente"
    step="revenus-locatifs"
  />
  <BackLinkRow
    :label="t('have-receipt.' + textKey)"
    :to="parent"
    category="rente"
    step="revenus-locatifs"
    substep="quittance"
  />
  <EnterMonthlyIncome :amount="1200" />
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
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'
import EnterMonthlyIncome from '../lib/EnterMonthlyIncome.vue'
import { useFinancialState } from '../financialState'

const { t } = useI18n()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
const { textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "rental-income": {
      "tenant": "You receive rental income",
      "guarantor": "Your guarantor receives rental income",
      "couple": "Your spouse receives rental income",
      "couple-guarantor": "Their guarantor receives rental income",
    },
    "have-receipt": {
      "tenant": "You have a receipt",
      "guarantor": "Your guarantor has a receipt",
      "couple": "Your spouse has a receipt",
      "couple-guarantor": "Their guarantor has a receipt",
    },
    "please-provide": "Please provide {0}.",
    "recent-receipt": "a receipt less than 3 months old",
  },
  "fr": {
    "rental-income": {
      "tenant": "Vous touchez des revenus locatifs",
      "guarantor": "Votre garant touche des revenus locatifs",
      "couple": "Votre conjoint touche des revenus locatifs",
      "couple-guarantor": "Son conjoint touche des revenus locatifs",
    },
    "have-receipt": {
      "tenant": "Vous avez une quittance",
      "guarantor": "Votre garant a une quittance",
      "couple": "Votre conjoint a une quittance",
      "couple-guarantor": "Son garant a une quittance",
    },
    "please-provide": "Veuillez fournir {0}.",
    "recent-receipt": "une quittance de moins de 3 mois",
  }
}
</i18n>
