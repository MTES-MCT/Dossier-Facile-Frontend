<template>
  <AlertRealisticAmount pclass="bold">
    <p>{{ t('example') }}</p>
  </AlertRealisticAmount>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AlertRealisticAmount from './AlertRealisticAmount.vue'

const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "example": "For example: if your contract specifies a sum of €30,000 per year, your net monthly salary is €30,000/12x0.75=€1,875 net per month."
  },
  "fr": {
    "example": "Par exemple : si votre contrat indique un montant de 30000€ par an, votre salaire net mensuel est de 30000/12x0,75=1875€ net par mois."
  }
}
</i18n>
