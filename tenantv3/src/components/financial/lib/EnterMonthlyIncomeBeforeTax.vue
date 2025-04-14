<template>
  <i18n-t :keypath="'enter-income-' + suffix" class="fr-mb-1w" tag="p">
    <strong>{{ t('net-income') }}</strong>
  </i18n-t>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'

const { t } = useI18n()
const { suffix } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "enter-income-tenant": "Enter your {0}, without comma:",
    "enter-income-other": "Enter their {0}, without comma:",
    "net-income":"average net monthly income before withholding tax"
  },
  "fr": {
    "enter-income-tenant": "Saisissez votre {0}, sans virgule :",
    "enter-income-other": "Saisissez son {0}, sans virgule :",
    "net-income":"revenu mensuel net moyen avant prélèvement à la source"
  }
}
</i18n>
