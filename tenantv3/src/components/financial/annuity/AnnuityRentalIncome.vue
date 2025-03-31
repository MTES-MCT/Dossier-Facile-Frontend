<template>
  <BackLinkRow :label="t('form.financial.annuity')" :to="grandparent" />
  <BackLinkRow :label="t('rental-income')" :to="parent" />
  <RadioList>
    <RadioListItem :to="here + '/quittance'">{{ t('have-receipt') }}</RadioListItem>
    <RadioListItem :to="here + '/pas-de-quittance'">{{ t('no-receipt') }}</RadioListItem>
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

const { t } = useI18n()
const route = useRoute()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const here = computed(() => route.path)
</script>

<i18n>
{
  "en": {
    "rental-income": "You receive rental income",
    "have-receipt": "You have a receipt",
    "no-receipt": "You don't have a receipt"
  },
  "fr": {
    "rental-income": "Vous touchez des revenus locatifs",
    "have-receipt": "Vous avez une quittance",
    "no-receipt": "Vous n’avez pas de quittance"
  }
}
</i18n>
