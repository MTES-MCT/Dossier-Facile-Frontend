<template>
  <AlertRealisticAmount pclass="bold">
    <p>{{ t('example-' + suffix) }}</p>
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
    "example-tenant": "For example: if your contract specifies a sum of €30,000 per year, your net monthly salary is €30,000/12x0.75=€1,875 net per month.",
    "example-other": "For example: if your contract specifies a sum of €30,000 per year, your net monthly salary is €30,000/12x0.75=€1,875 net per month."
  },
  "fr": {
    "example-tenant": "Par exemple : si votre contrat indique un montant de 30000€ par an, votre salaire net mensuel est de 30000/12x0,75=1875€ net par mois.",
    "example-other": "Par exemple : si son contrat indique un montant de 30000€ par an, son salaire net mensuel est de 30000/12x0,75=1875€ net par mois."
  }
}
</i18n>
