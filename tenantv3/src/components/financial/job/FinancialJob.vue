<template>
  <BackLinkRow :label="t('form.financial.job-income')" :to="parent" />
  <p>{{ t('you-are.' + textKey) }}</p>
  <RadioList>
    <RadioListItem :to="here + '/salarie'" @click="sendEvent('employed')">{{
      t('employee')
    }}</RadioListItem>
    <RadioListItem :to="here + '/independant'" @click="sendEvent('freelance')">{{
      t('freelance')
    }}</RadioListItem>
    <RadioListItem :to="here + '/intermittent'" @click="sendEvent('intermittent')">{{
      t('intermittent')
    }}</RadioListItem>
    <RadioListItem :to="here + '/artiste-auteur'" @click="sendEvent('artist-author')">{{
      t('artist-author')
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
const here = computed(() => route.path)
const parent = useParentRoute()
const { textKey } = useFinancialState()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation2('financial', 'travail', subCategory)
</script>

<i18n>
{
  "en": {
    "you-are": {
      "tenant": "You are:",
      "couple": "Your spouse's situation:",
      "guarantor": "Your guarantor's situation:",
      "couple-guarantor": "The situation of their guarantor:"
    },
    "employee": "employee",
    "freelance": "self-employed",
    "intermittent": "intermittent",
    "artist-author": "artist-author"
  },
  "fr": {
    "you-are": {
      "tenant": "Vous êtes :",
      "couple": "La situation de votre conjoint :",
      "guarantor": "La situation de votre garant :",
      "couple-guarantor": "La situation de son garant :"
    },
    "employee": "salarié",
    "freelance": "indépendant",
    "intermittent": "intermittent",
    "artist-author": "artiste-auteur"
  }
}
</i18n>
