<template>
  <p class="fr-mb-1w">{{ t('enter-income-' + suffix) }}</p>
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
    "enter-income-tenant": "Enter your average net monthly income:",
    "enter-income-other": "Enter their average net monthly income:",
  },
  "fr": {
    "enter-income-tenant": "Saisissez le montant de vos revenus mensuels nets moyens :",
    "enter-income-other": "Saisissez le montant de ses revenus mensuels nets moyens :",
  }
}
</i18n>
