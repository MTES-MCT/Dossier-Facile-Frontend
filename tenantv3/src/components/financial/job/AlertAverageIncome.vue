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
    "average": "Please make an honest average of your income."
  },
  "fr": {
    "average": "Veuillez faire une moyenne honnête de vos revenus."
  }
}
</i18n>
