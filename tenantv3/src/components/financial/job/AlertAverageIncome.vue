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
    "average-tenant": "Please make an honest average of your income.",
    "average-other": "Please make an honest average of their income."
  },
  "fr": {
    "average-tenant": "Veuillez faire une moyenne honnête de vos revenus.",
    "average-other": "Veuillez faire une moyenne honnête de ses revenus."
  }
}
</i18n>
