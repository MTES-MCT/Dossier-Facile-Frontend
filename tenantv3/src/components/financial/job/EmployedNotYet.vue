<template>
  <BackLinkRow :label="t('form.financial.job-income')" :to="ancestor" />
  <BackLinkRow :label="t('form.financial.employed.' + textKey)" :to="grandparent" />
  <BackLinkRow :label="t('not-yet-started')" :to="parent" />
  <EnterMonthlyIncomeBeforeTax />
  <UploadFilesFinancial category="SALARY" step="SALARY_EMPLOYED_NOT_YET">
    <template #emptyIncome>
      <AlertEmployedNotYet />
    </template>
    <template #incomeFilled>
      <AlertEmployedNotYet class="fr-mb-3w" />
      <i18n-t keypath="please-provide" tag="p">
        <strong>{{ t('contract-page-' + suffix) }}</strong>
      </i18n-t>
      <div class="fr-alert fr-alert--info fr-mb-3w">
        <p>{{ t('if-you-dont-know') }}</p>
      </div>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import AlertEmployedNotYet from './AlertEmployedNotYet.vue'
import { useI18n } from 'vue-i18n'
import EnterMonthlyIncomeBeforeTax from '../lib/EnterMonthlyIncomeBeforeTax.vue'
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
    "not-yet-started": "Not yet started or less than a month old",
    "please-provide": "Please provide {0}.",
    "contract-page-tenant": "the page of your contract indicating your future remuneration",
    "contract-page-other": "the page of their contract indicating their future remuneration",
    "if-you-dont-know": "If you don't know how to extract a page from your contract, you can provide a screenshot of that page."
  },
  "fr": {
    "not-yet-started": "Pas encore commencé ou depuis moins d’un mois",
    "please-provide": "Veuillez fournir {0}.",
    "contract-page-tenant": "la page de votre contrat qui indique votre rémunération à venir",
    "contract-page-other": "la page de son contrat qui indique sa rémunération à venir",
    "if-you-dont-know": "Si vous ne savez pas extraire une page de votre contrat, vous pouvez fournir une copie d’écran de cette page."
  }
}
</i18n>
