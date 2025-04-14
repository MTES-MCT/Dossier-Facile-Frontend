<template>
  <AlertRealisticAmount pclass="bold">
    <p>{{ t('average-' + suffix) }}</p>
  </AlertRealisticAmount>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AlertRealisticAmount from './AlertRealisticAmount.vue'
import { useFinancialState } from '../financialState'

const { t } = useI18n()
const { suffix } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "average-tenant": "Average your income over the last 3 months. Don't forget to subtract your employee contributions.",
    "average-other": "Average their income over the last 3 months. Don't forget to subtract employee contributions."
  },
  "fr": {
    "average-tenant": "Faites la moyenne de vos revenus de ces 3 derniers mois. N’oubliez pas de retrancher vos cotisations salariales.",
    "average-other": "Faites la moyenne de ses revenus de ces 3 derniers mois. N’oubliez pas de retrancher les cotisations salariales."
  }
}
</i18n>
