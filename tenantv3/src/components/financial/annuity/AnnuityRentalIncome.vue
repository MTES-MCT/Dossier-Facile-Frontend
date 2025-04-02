<template>
  <BackLinkRow :label="t('form.financial.annuity')" :to="grandparent" />
  <BackLinkRow :label="t('rental-income.' + textKey)" :to="parent" />
  <RadioList>
    <RadioListItem :to="here + '/quittance'">{{ t('have-receipt.' + textKey) }}</RadioListItem>
    <RadioListItem :to="here + '/pas-de-quittance'">{{ t('no-receipt.' + textKey) }}</RadioListItem>
  </RadioList>
  <FinancialFooter />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'

const { t } = useI18n()
const route = useRoute()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const here = computed(() => route.path)
const { textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "rental-income": {
      "tenant": "You receive rental income",
      "guarantor": "Your guarantor receives rental income",
      "couple": "Your spouse receives rental income",
      "couple-guarantor": "Their guarantor receives rental income",
    },
    "have-receipt": {
      "tenant": "You have a receipt",
      "guarantor": "Your guarantor has a receipt",
      "couple": "Your spouse has a receipt",
      "couple-guarantor": "Their guarantor has a receipt",
    },
    "no-receipt": {
      "tenant": "You don't have a receipt",
      "guarantor": "Your guarantor has no receipt",
      "couple": "Your spouse has no receipt",
      "couple-guarantor": "Their guarantor has no receipt",
    }
  },
  "fr": {
    "rental-income": {
      "tenant": "Vous touchez des revenus locatifs",
      "guarantor": "Votre garant touche des revenus locatifs",
      "couple": "Votre conjoint touche des revenus locatifs",
      "couple-guarantor": "Son conjoint touche des revenus locatifs",
    },
    "have-receipt": {
      "tenant": "Vous avez une quittance",
      "guarantor": "Votre garant a une quittance",
      "couple": "Votre conjoint a une quittance",
      "couple-guarantor": "Son garant a une quittance",
    },
    "no-receipt": {
      "tenant": "Vous n’avez pas de quittance",
      "guarantor": "Votre garant n’a pas de quittance",
      "couple": "Votre conjoint n’a pas de quittance",
      "couple-guarantor": "Son garant n’a pas de quittance",
    }
  }
}
</i18n>
