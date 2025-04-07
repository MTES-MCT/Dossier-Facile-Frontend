<template>
  <BackLinkRow :label="t('form.financial.annuity')" :to="parent" category="rente" />
  <p>{{ t('you-receive.' + textKey) }}</p>
  <RadioList>
    <RadioListItem :to="here + '/revenus-locatifs'" @click="sendEvent('revenus-locatifs')">{{
      t('rental-income')
    }}</RadioListItem>
    <RadioListItem :to="here + '/viagere'" @click="sendEvent('viagere')">{{
      t('life-annuity')
    }}</RadioListItem>
    <RadioListItem :to="here + '/autre'" @click="sendEvent('autre')">{{
      t('other-pension')
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
