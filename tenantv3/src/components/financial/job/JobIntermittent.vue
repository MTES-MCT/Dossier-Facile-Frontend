<template>
  <BackLinkRow :label="t('form.financial.job-income')" :to="grandparent" category="travail" />
  <BackLinkRow
    :label="t('intermittent.' + textKey)"
    :to="parent"
    category="travail"
    step="intermittent"
  />
  <EnterMonthlyIncomeBeforeTax />
  <UploadFilesFinancial category="SALARY" step="SALARY_INTERMITTENT">
    <template #emptyIncome>
      <AlertAverageIncome />
    </template>
    <template #incomeFilled>
      <AlertAverageIncome class="fr-mb-3w" />
      <i18n-t :keypath="'please-provide-' + suffix" tag="p">
        <strong>{{ t('proof') }}</strong>
      </i18n-t>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import AlertAverageIncome from './AlertAverageIncome.vue'
import EnterMonthlyIncomeBeforeTax from '../lib/EnterMonthlyIncomeBeforeTax.vue'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'

const { t } = useI18n()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const { suffix, textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "intermittent": {
      "tenant": "You are an intermittent",
      "guarantor": "Your guarantor is an intermittent",
      "couple": "Your spouse is an intermittent",
      "couple-guarantor": "Their guarantor is an intermittent",
    },
    "please-provide-tenant":"Please provide your {0}. If you don't have them, you can provide your last 3 France Travail payment certificates and your pay slips for the last 3 months. Please note that these documents are more difficult for a landlord to read when there are too many of them.",
    "please-provide-other":"Please provide their {0}. If you don't have them, you can provide their last 3 France Travail payment certificates and their pay slips for the last 3 months. Please note that these documents are more difficult for a landlord to read when there are too many of them.",
    "proof": "last 3 proofs of monthly status"
  },
  "fr": {
    "intermittent": {
      "tenant": "Vous êtes intermittent",
      "guarantor": "Votre garant est intermittent",
      "couple": "Votre conjoint est intermittent",
      "couple-guarantor": "Son garant est intermittent",
    },
    "please-provide-tenant": "Veuillez fournir vos {0}. Si vous ne les avez pas, vous pouvez fournir vos 3 dernières attestations de paiement France Travail et vos bulletins de salaire de ces 3 derniers mois. Veuillez noter que ces documents sont plus difficiles à lire pour un propriétaire lorsqu’ils sont trop nombreux.",
    "please-provide-other": "Veuillez fournir ses {0}. Si vous ne les avez pas, vous pouvez fournir ses 3 dernières attestations de paiement France Travail et ses bulletins de salaire de ces 3 derniers mois. Veuillez noter que ces documents sont plus difficiles à lire pour un propriétaire lorsqu’ils sont trop nombreux.",
    "proof": "3 derniers justificatifs de déclaration de situation mensuelle"
  }
}
</i18n>
