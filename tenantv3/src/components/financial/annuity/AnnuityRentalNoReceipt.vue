<template>
  <BackLinkRow :label="t('form.financial.annuity')" :to="ancestor" />
  <BackLinkRow :label="t('rental-income.' + textKey)" :to="grandparent" />
  <BackLinkRow :label="t('no-receipt.' + textKey)" :to="parent" />
  <EnterMonthlyIncome />
  <UploadFilesFinancial category="RENT" step="RENT_RENTAL_NO_RECEIPT">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide"
        ><strong>{{ t('latest-tax-notice-' + suffix) }}</strong></i18n-t
      >
      <AlertRealisticAmount pclass="bold" class="fr-mb-3w">
        <p>{{ t('for-example-' + suffix) }}</p>
      </AlertRealisticAmount>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'
import AlertRealisticAmount from '../job/AlertRealisticAmount.vue'
import EnterMonthlyIncome from '../lib/EnterMonthlyIncome.vue'
import { useFinancialState } from '../financialState'

const { t } = useI18n()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
const { suffix, textKey } = useFinancialState()
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
    "no-receipt": {
      "tenant": "You don't have a receipt",
      "guarantor": "Your guarantor has no receipt",
      "couple": "Your spouse has no receipt",
      "couple-guarantor": "Their guarantor has no receipt",
    },
    "please-provide": "Please provide {0}.",
    "latest-tax-notice-tenant": "your latest tax notice 2023-24",
    "latest-tax-notice-other": "their latest tax notice 2023-24",
    "for-example-tenant": "For example: if the “property income” line on your tax form shows €12,000, your rental income is 12000÷12=1000€.",
    "for-example-other": "For example: if the “property income” line on their tax form shows €12,000, their rental income is 12000÷12=1000€."
  },
  "fr": {
    "rental-income": {
      "tenant": "Vous touchez des revenus locatifs",
      "guarantor": "Votre garant touche des revenus locatifs",
      "couple": "Votre conjoint touche des revenus locatifs",
      "couple-guarantor": "Son conjoint touche des revenus locatifs",
    },
    "no-receipt": {
      "tenant": "Vous n’avez pas de quittance",
      "guarantor": "Votre garant n’a pas de quittance",
      "couple": "Votre conjoint n’a pas de quittance",
      "couple-guarantor": "Son garant n’a pas de quittance",
    },
    "please-provide": "Veuillez fournir {0}.",
    "latest-tax-notice-tenant": "votre dernier avis d’imposition 2023-24",
    "latest-tax-notice-other": "son dernier avis d’imposition 2023-24",
    "for-example-tenant": "Par exemple : si la ligne “revenus fonciers” de votre avis d’imposition indique 12000€, le montant de vos revenus locatifs est de 12000÷12=1000€.",
    "for-example-other": "Par exemple : si la ligne “revenus fonciers” de son avis d’imposition indique 12000€, le montant des revenus locatifs est de 12000÷12=1000€."
  }
}
</i18n>
