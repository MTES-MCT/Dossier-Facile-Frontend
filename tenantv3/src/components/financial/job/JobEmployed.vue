<template>
  <BackLinkRow :label="t('form.financial.job-income')" :to="grandparent" category="travail" />
  <BackLinkRow
    :label="t('form.financial.employed.' + textKey)"
    :to="parent"
    category="travail"
    step="salarie"
  />
  <RadioList :list-items="optionLinks" @analytics="sendEvent" />
  <FinancialFooter disabled />
</template>

<script setup lang="ts">
import RadioList, { type OptionLink } from '@/components/common/RadioList.vue'
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useRoute } from 'vue-router'
import { computed, type ComputedRef } from 'vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'
import { AnalyticsService } from '@/services/AnalyticsService'

const { t } = useI18n()
const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const { category, textKey } = useFinancialState()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation3(category, 'travail', 'salarie', subCategory)

const optionLinks: ComputedRef<OptionLink[]> = computed(() => [
  {
    to: `${here.value}/plus-3-mois`,
    title: t('form.financial.more-3-months'),
    event: 'plus-3-mois'
  },
  {
    to: `${here.value}/moins-3-mois`,
    title: t('form.financial.less-3-months'),
    event: 'moins-3-mois'
  },
  {
    to: `${here.value}/pas-encore`,
    title: t('not-yet.' + textKey),
    event: 'pas-encore'
  }
])
</script>

<i18n>
{
  "en": {
    "not-yet": {
        "tenant": "You have not yet taken up your position or you have been on the job for less than a month",
        "guarantor": "Your guarantor has not yet taken up his or her position, or has been on the job for less than a month",
        "couple": "Your spouse has not yet taken up his or her position, or has been on the job for less than a month",
        "couple-guarantor": "His guarantor has not yet taken up his or her position, or has been on the job for less than a month"
    }
  },
  "fr": {
    "not-yet": {
        "tenant": "Vous n’avez pas encore pris votre poste ou vous avez commencé depuis moins d’un mois",
        "guarantor": "Votre garant n’a pas encore pris son poste ou il a commencé depuis moins d’un mois",
        "couple": "Votre conjoint n’a pas encore pris son poste ou il a commencé depuis moins d’un mois",
        "couple-guarantor": "Son garant n’a pas encore pris son poste ou il a commencé depuis moins d’un mois"
    }
  }
}
</i18n>
