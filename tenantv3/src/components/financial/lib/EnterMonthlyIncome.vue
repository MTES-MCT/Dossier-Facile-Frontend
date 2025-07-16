<template>
  <i18n-t v-if="beforeTax" :keypath="'enter-income-' + suffix" class="fr-mb-0" tag="p">
    <strong>{{ t('net-income') }}</strong>
  </i18n-t>
  <p v-else class="fr-mb-0">{{ t('enter-avg-income-' + suffix) }}</p>
  <p class="text-grey fr-text--xs fr-mb-2w">{{ t('example') }}{{ amount }}</p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'

const { amount = 2400 } = defineProps<{ beforeTax?: boolean; amount?: number }>()

const { t } = useI18n()
const { suffix } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "enter-avg-income-tenant": "Enter your average net monthly income:",
    "enter-avg-income-other": "Enter their average net monthly income:",
    "enter-income-tenant": "Enter your {0}, without comma:",
    "enter-income-other": "Enter their {0}, without comma:",
    "net-income":"average net monthly income before withholding tax",
    "example": "Example: "
  },
  "fr": {
    "enter-avg-income-tenant": "Saisissez le montant de vos revenus mensuels nets moyens :",
    "enter-avg-income-other": "Saisissez le montant de ses revenus mensuels nets moyens :",
    "enter-income-tenant": "Saisissez votre {0}, sans virgule :",
    "enter-income-other": "Saisissez son {0}, sans virgule :",
    "net-income":"revenu mensuel net moyen avant prélèvement à la source",
    "example": "Exemple: "
  }
}
</i18n>
