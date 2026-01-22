<template>
  <BackLinkRow :label="t('form.financial.job-income')" :to="parent" category="travail" />
  <p>{{ t('you-are.' + textKey) }}</p>
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
  AnalyticsService.selectSituation2(category, 'travail', subCategory)

const optionLinks: ComputedRef<optionLink[]> = computed(() => [
  {
    to: `${here.value}/salarie`,
    title: t('employee'),
    event: 'salarie'
  },
  {
    to: `${here.value}/independant`,
    title: t('freelance'),
    event: 'independant'
  },
  {
    to: `${here.value}/intermittent`,
    title: t('intermittent'),
    event: 'intermittent'
  },
  {
    to: `${here.value}/artiste-auteur`,
    title: t('artist-author'),
    event: 'artiste-auteur'
  }
])
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
