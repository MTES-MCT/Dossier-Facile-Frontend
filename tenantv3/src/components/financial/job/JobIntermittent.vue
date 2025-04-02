<template>
  <BackLinkRow :label="t('form.financial.job-income')" :to="grandparent" />
  <BackLinkRow :label="t('intermittent')" :to="parent" />
  <EnterMonthlyIncome />
  <UploadFilesFinancial category="SALARY" step="SALARY_INTERMITTENT">
    <template #emptyIncome>
      <AlertAverageIncome />
    </template>
    <template #incomeFilled>
      <AlertAverageIncome class="fr-mb-3w" />
      <i18n-t keypath="please-provide" tag="p">
        <strong>{{ t('proof') }}</strong>
      </i18n-t>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import AlertAverageIncome from './AlertAverageIncome.vue'
import EnterMonthlyIncome from '../lib/EnterMonthlyIncome.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
</script>

<i18n>
{
  "en": {
    "intermittent": "You are an intermittent",
    "please-provide":"Please provide your {0}. If you don't have them, you can provide your last 3 France Travail payment certificates and your pay slips for the last 3 months. Please note that these documents are more difficult for a landlord to read when there are too many of them.",
    "proof": "last 3 proofs of monthly status"
  },
  "fr": {
    "intermittent": "Vous êtes intermittent",
    "please-provide": "Veuillez fournir vos {0}. Si vous ne les avez pas, vous pouvez fournir vos 3 dernières attestations de paiement France Travail et vos bulletins de salaire de ces 3 derniers mois. Veuillez noter que ces documents sont plus difficiles à lire pour un propriétaire lorsqu’ils sont trop nombreux.",
    "proof": "3 derniers justificatifs de déclaration de situation mensuelle"
  }
}
</i18n>
