<template>
  <BackLinkRow :label="t('form.financial.job-income')" :to="grandparent" category="travail" />
  <BackLinkRow
    :label="t('form.financial.employed.' + textKey)"
    :to="parent"
    category="travail"
    step="salarie"
  />
  <RadioList>
    <RadioListItem :to="here + '/plus-3-mois'" @click="sendEvent('plus-3-mois')">{{
      t('form.financial.more-3-months')
    }}</RadioListItem>
    <RadioListItem :to="here + '/moins-3-mois'" @click="sendEvent('moins-3-mois')">{{
      t('form.financial.less-3-months')
    }}</RadioListItem>
    <RadioListItem :to="here + '/pas-encore'" @click="sendEvent('pas-encore')">{{
      t('not-yet.' + textKey)
    }}</RadioListItem>
  </RadioList>
  <FinancialFooter disabled />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
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
