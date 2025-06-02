<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-grid-col">
    <GuarantorBadge />
    <h6>{{ t('income.' + textKey) }}</h6>
    <RouterView />
  </NakedCard>
</template>

<script setup lang="ts">
import GuarantorBadge from '@/components/common/GuarantorBadge.vue'
import { useFinancialState } from '@/components/financial/financialState'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "income": {
      "guarantor": "Your guarantor's income",
      "couple-guarantor": "Income of your spouse's guarantor"
    }
  },
  "fr": {
    "income": {
      "guarantor": "Revenus de votre garant",
      "couple-guarantor": "Revenus du garant de votre conjoint"
    }
  }
}
</i18n>
