<template>
  <BackLinkRow :label="t('form.financial.retirement-or-pension')" :to="parent" category="pension" />
  <p>{{ t('you-receive.' + textKey) }}</p>
  <RadioList :list-items="optionLinks" @analytics="sendEvent" />
  <FinancialFooter disabled />
</template>

<script setup lang="ts">
import RadioList, { type optionLink } from '@/components/common/RadioList.vue'
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
const here = computed(() => route.path)
const parent = useParentRoute()
const { category, textKey } = useFinancialState()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation2(category, 'pension', subCategory)

const optionLinks: ComputedRef<optionLink[]> = computed(() => [
  {
    to: `${here.value}/retraite`,
    title: t('pension'),
    event: 'retraite'
  },
  {
    to: `${here.value}/invalidite`,
    title: t('disability-pension'),
    event: 'invalidite'
  },
  {
    to: `${here.value}/alimentaire`,
    title: t('alimony'),
    event: 'alimentaire'
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
    "pension": "a pension",
    "disability-pension": "a disability pension",
    "alimony": "alimony"
  },
  "fr": {
    "you-receive": {
      "tenant": "Vous touchez :",
      "guarantor": "Votre garant touche :",
      "couple": "Votre conjoint touche :",
      "couple-guarantor": "Son garant touche :",
    },
    "pension": "une retraite",
    "disability-pension": "une pension d’invalidité",
    "alimony": "une pension alimentaire"
  }
}
</i18n>
