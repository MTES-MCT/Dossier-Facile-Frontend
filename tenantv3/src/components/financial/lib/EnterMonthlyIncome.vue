<template>
  <i18n-t
    v-if="beforeTax"
    :keypath="'enter-income-' + suffix"
    class="fr-mb-0"
    tag="label"
    for="monthlySum"
  >
    <strong>{{ t('net-income') }}</strong>
  </i18n-t>
  <label v-else class="fr-mb-0" for="monthlySum">{{ t('enter-avg-income-' + suffix) }}</label>
  <p id="monthlySum-desc" class="text-grey fr-text--xs fr-mb-1w">{{ t('example') }}{{ amount }}</p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'

const { amount = 2400 } = defineProps<{ beforeTax?: boolean; amount?: number }>()

const { t } = useI18n()
const { suffix } = useFinancialState()
</script>

<i18n lang="json">
{
  "en": {
    "enter-avg-income-tenant": "Enter your average net monthly income in euros (required)",
    "enter-avg-income-other": "Enter their average net monthly income in euros (required)",
    "enter-income-tenant": "Enter your {0}, without comma (required)",
    "enter-income-other": "Enter their {0}, without comma (required)",
    "net-income": "average net monthly income in euros before withholding tax",
    "example": "Example: "
  },
  "fr": {
    "enter-avg-income-tenant": "Saisissez le montant de vos revenus mensuels nets moyens en euros (obligatoire)",
    "enter-avg-income-other": "Saisissez le montant de ses revenus mensuels nets moyens en euros (obligatoire)",
    "enter-income-tenant": "Saisissez votre {0}, sans virgule (obligatoire)",
    "enter-income-other": "Saisissez son {0}, sans virgule (obligatoire)",
    "net-income": "revenu mensuel net moyen en euros avant prélèvement à la source",
    "example": "Exemple : "
  }
}
</i18n>
