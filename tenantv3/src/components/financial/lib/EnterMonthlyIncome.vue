<template>
  <i18n-t keypath="enter-income" class="fr-mb-1w" tag="p">
    <strong>{{ t('net-income') }}</strong>
  </i18n-t>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "enter-income": "Enter your {0}, without comma:",
    "net-income":"average net monthly income before withholding tax"
  },
  "fr": {
    "enter-income": "Saisissez votre {0}, sans virgule :",
    "net-income":"revenu mensuel net moyen avant prélèvement à la source"
  }
}
</i18n>
