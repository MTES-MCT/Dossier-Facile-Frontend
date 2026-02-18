<template>
  <BackLinkRow :label="t('form.financial.job-income')" :to="grandparent" category="travail" />
  <BackLinkRow
    :label="t('form.financial.self-employed.' + textKey)"
    :to="parent"
    category="travail"
    step="independant"
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
  AnalyticsService.selectSituation3(category, 'travail', 'independant', subCategory)

const optionLinks: ComputedRef<OptionLink[]> = computed(() => [
  {
    to: `${here.value}/auto-entrepreneur`,
    title: t('is-auto-entrepreneur.' + textKey),
    event: 'auto-entrepreneur'
  },
  {
    to: `${here.value}/autre`,
    title: t('not-auto-entrepreneur.' + textKey),
    event: 'autre'
  }
])
</script>

<i18n>
{
  "en": {
    "is-auto-entrepreneur": {
      "tenant": "You are an auto-entrepreneur",
      "guarantor": "Your guarantor is an auto-entrepreneur",
      "couple": "Your spouse is an auto-entrepreneur",
      "couple-guarantor": "Their guarantor is an auto-entrepreneur",
    },
    "not-auto-entrepreneur": {
      "tenant": "You are not an auto-entrepreneur",
      "guarantor": "Your guarantor is not an auto-entrepreneur",
      "couple": "Your spouse is not an auto-entrepreneur",
      "couple-guarantor": "Their guarantor is not an auto-entrepreneur",
    }
  },
  "fr": {
    "is-auto-entrepreneur": {
      "tenant": "Vous êtes auto-entrepreneur",
      "guarantor": "Votre garant est auto-entrepreneur",
      "couple": "Votre conjoint est auto-entrepreneur",
      "couple-guarantor": "Son garant est auto-entrepreneur"
    },
    "not-auto-entrepreneur": {
      "tenant": "Vous n’êtes pas auto-entrepreneur",
      "guarantor": "Votre garant n’est pas auto-entrepreneur",
      "couple": "Votre conjoint n’est pas auto-entrepreneur",
      "couple-guarantor": "Son garant n’est pas auto-entrepreneur"
    }
  }
}
</i18n>
