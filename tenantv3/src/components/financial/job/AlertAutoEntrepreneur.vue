<template>
  <AlertRealisticAmount pclass="bold">
    <p>{{ t('average') }}</p>
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
    "average": "Average your income over the last 3 months. Don't forget to subtract your employee contributions."
  },
  "fr": {
    "average": "Faites la moyenne de vos revenus de ces 3 derniers mois. N’oubliez pas de retrancher vos cotisations salariales."
  }
}
</i18n>
