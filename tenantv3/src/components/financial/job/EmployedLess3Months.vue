<template>
  <BackLinkRow :label="t('form.financial.job-income')" :to="ancestor" />
  <BackLinkRow :label="t('form.financial.employed.' + textKey)" :to="grandparent" />
  <BackLinkRow :label="t('form.financial.less-3-months')" :to="parent" />
  <EnterMonthlyIncomeBeforeTax />
  <UploadFilesFinancial category="SALARY" step="SALARY_EMPLOYED_LESS_3_MONTHS">
    <template #emptyIncome>
      <AlertRealisticAmount />
    </template>
    <template #incomeFilled>
      <AlertRealisticAmount class="fr-mb-3w" />
      <i18n-t keypath="please-provide" tag="p">
        <strong>{{ t('all-pay-slips') }}</strong>
      </i18n-t>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import AlertRealisticAmount from './AlertRealisticAmount.vue'
import { useI18n } from 'vue-i18n'
import EnterMonthlyIncomeBeforeTax from '../lib/EnterMonthlyIncomeBeforeTax.vue'
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
    "please-provide": "Please provide {0} (one or two).",
    "all-pay-slips": "any pay slips you may have"
  },
  "fr": {
    "please-provide": "Veuillez fournir {0} (un ou deux bulletins).",
    "all-pay-slips": "tous les bulletins de salaire dont vous disposez"
  }
}
</i18n>
