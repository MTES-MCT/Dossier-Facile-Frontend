<template>
  <BackLinkRow :label="t('form.financial.job-income')" :to="grandparent" />
  <BackLinkRow :label="t('unknown')" :to="parent" />
  <WarningUpdate />
  <EnterMonthlyIncome />
  <UploadFilesFinancial category="SALARY" step="SALARY_UNKNOWN" no-upload>
    <template #incomeFilled>
      <i18n-t keypath="please-provide" class="fr-mb-0" tag="p">
        <strong>{{ t('last-3-pay-slips') }}</strong>
      </i18n-t>
      <ul class="bold">
        <li v-for="(m, i) of months.slice(0, 3)" :key="i">
          {{ m }}
        </li>
      </ul>
      <p>{{ t('can-add-last-month-slip', [months[3]]) }}</p>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import EnterMonthlyIncome from './EnterMonthlyIncome.vue'
import { useI18n } from 'vue-i18n'
import { lastMonths } from '../lib/lastMonths'
import WarningUpdate from '../lib/WarningUpdate.vue'

const { t } = useI18n()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const months = lastMonths()
</script>

<i18n>
{
  "en": {
    "unknown": "Unknown",
    "please-provide": "Please provide your {0}:",
    "last-3-pay-slips": "last 3 pay slips",
    "can-add-last-month-slip": "You can add the {0} pay slip if you have it.",
  },
  "fr": {
    "unknown": "Non renseigné",
    "please-provide": "Veuillez fournir vos {0} :",
    "last-3-pay-slips": "3 derniers bulletins de salaire",
    "can-add-last-month-slip": "Vous pouvez ajouter le bulletin de {0} si vous l’avez.",
  }
}
</i18n>
