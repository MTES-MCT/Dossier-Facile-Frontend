<template>
  <BackLinkRow :label="t('form.financial.annuity')" :to="parent" category="rente" />
  <p>{{ t('you-receive.' + textKey) }}</p>
  <RadioList :list-items="optionLinks" @analytics="sendEvent" />
  <FinancialFooter disabled />
</template>

<script setup lang="ts">
import RadioList, { type OptionLink } from '@/components/common/RadioList.vue'
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useRoute } from 'vue-router'
import { computed, type ComputedRef } from 'vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'

const { t } = useI18n()
const route = useRoute()
const parent = useParentRoute()
const here = computed(() => route.path)
const { category, textKey } = useFinancialState()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation2(category, 'rente', subCategory)

const optionLinks: ComputedRef<OptionLink[]> = computed(() => [
  {
    to: `${here.value}/revenus-locatifs`,
    title: t('rental-income'),
    event: 'revenus-locatifs'
  },
  {
    to: `${here.value}/viagere`,
    title: t('life-annuity'),
    event: 'viagere'
  },
  {
    to: `${here.value}/autre`,
    title: t('other-pension'),
    event: 'autre'
  }
])
</script>

<i18n>
{
  "en": {
    "you-receive": {
      "tenant": "You receive:",
      "guarantor": "Your guarantor receive:",
      "couple": "Your spouse receive:",
      "couple-guarantor": "Their guarantor receive:",
    },
    "rental-income": "rental income",
    "life-annuity": "a life annuity",
    "other-pension": "another type of pension"
  },
  "fr": {
    "you-receive": {
      "tenant": "Vous touchez :",
      "guarantor": "Votre garant touche :",
      "couple": "Votre conjoint touche :",
      "couple-guarantor": "Son garant touche :",
    },
    "rental-income": "des revenus locatifs",
    "life-annuity": "une rente viagère",
    "other-pension": "un autre type de rente"
  }
}
</i18n>
