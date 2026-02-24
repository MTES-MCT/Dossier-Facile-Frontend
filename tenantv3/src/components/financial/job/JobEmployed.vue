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
import RadioList from '@/components/common/RadioList.vue'
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useSocialOptionLinks } from '../social/lib/useSocialOptionLinks'

const { t } = useI18n()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const { category, textKey } = useFinancialState()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation3(category, 'travail', 'salarie', subCategory)

const optionLinks = useSocialOptionLinks(textKey)
</script>

<i18n lang="json">
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
