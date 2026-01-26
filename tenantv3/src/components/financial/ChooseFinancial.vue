<template>
  <RadioList :list-items="optionLinks" @analytics="sendEvent"/>
  <FinancialFooter disabled />
</template>

<script setup lang="ts">
import RadioList, { type OptionLink } from '@/components/common/RadioList.vue'
import FinancialFooter from './lib/FinancialFooter.vue'
import { useRoute } from 'vue-router'
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from './financialState'
import { AnalyticsService } from "@/services/AnalyticsService"

const { t } = useI18n()
const route = useRoute()
const here = computed(() => route.path)
const { category, documents } = useFinancialState()

const showNoIncome = computed(() => documents.value.length === 0 && !category.includes('guarantor'))

const sendEvent = (subcategory: string) => AnalyticsService.selectSituation(category, subcategory)

const optionLinks: ComputedRef<OptionLink[]> = computed(() => [
  {
    to: `${here.value}/travail`,
    title: t('form.financial.job-income'),
    event: 'job',
    description: t('employed')
  },
  {
    to: `${here.value}/social`,
    title: t('form.financial.social-aid'),
    event: 'social',
    description: t('social-aid')
  },
  {
    to: `${here.value}/pension`,
    title: t('form.financial.retirement-or-pension'),
    event: 'pension',
    description: t('pension')
  },
  {
    to: `${here.value}/rente`,
    title: t('form.financial.annuity'),
    event: 'annuity',
    description: t('annuity')
  },
  {
    to: `${here.value}/bourse`,
    title: t('form.financial.grant'),
    event: 'grant'
  },
  {
    to: `${here.value}/pas-de-revenus`,
    title: t('form.financial.no-income'),
    event: 'no-income',
    condition: showNoIncome.value
  }
])
</script>

<i18n>
{
  "en": {
    "employed": "Employee, self-employed, intermittent…",
    "social-aid": "Unemployment, family allowances, APL, RSA…",
    "pension": "Alimony, disability pension…",
    "annuity": "Rental income, life annuity…"
  },
  "fr": {
    "employed": "Salarié, indépendant, intermittent…",
    "social-aid": "Chômage, allocations familiales, APL, RSA…",
    "pension": "Pension alimentaire, d’invalidité…",
    "annuity": "Revenus locatifs, rente viagère…"
  }
}
</i18n>
