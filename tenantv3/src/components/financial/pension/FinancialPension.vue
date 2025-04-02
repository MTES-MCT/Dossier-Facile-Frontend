<template>
  <BackLinkRow :label="t('form.financial.retirement-or-pension')" :to="parent" />
  <p>{{ t('you-receive.' + textKey) }}</p>
  <RadioList>
    <RadioListItem :to="here + '/retraite'" @click="sendEvent('retraite')">{{
      t('pension')
    }}</RadioListItem>
    <RadioListItem :to="here + '/invalidite'" @click="sendEvent('invalidite')">{{
      t('disability-pension')
    }}</RadioListItem>
    <RadioListItem :to="here + '/alimentaire'" @click="sendEvent('alimentaire')">{{
      t('alimony')
    }}</RadioListItem>
  </RadioList>
  <FinancialFooter />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'

const { t } = useI18n()
const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()
const { textKey } = useFinancialState()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation2('financial', 'pension', subCategory)
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
