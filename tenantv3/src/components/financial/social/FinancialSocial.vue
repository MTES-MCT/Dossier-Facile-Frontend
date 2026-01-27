<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="parent" category="social" />
  <p>{{ t('you-receive.' + textKey) }}</p>
  <RadioList :list-items="optionLinks" @analytics="sendEvent" />
  <FinancialFooter disabled />
</template>

<script setup lang="ts">
import RadioList, { type OptionLink } from '@/components/common/RadioList.vue'
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
const { category, suffix, textKey } = useFinancialState()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation2(category, 'social', subCategory)

const optionLinks: ComputedRef<OptionLink[]> = computed(() => [
  {
    to: `${here.value}/caf`,
    title: t('form.financial.social.caf'),
    event: 'caf',
    description: t('rsa')
  },
  {
    to: `${here.value}/france-travail`,
    title: t('form.financial.social.france-travail'),
    event: 'france-travail',
    description: t('unemployment')
  },
  {
    to: `${here.value}/apl`,
    title: t('form.financial.social.apl'),
    event: 'apl',
    description: t('or-you-will-' + suffix)
  },
  {
    to: `${here.value}/aah`,
    title: t('form.financial.social.aah'),
    event: 'aah'
  },
  {
    to: `${here.value}/autre`,
    title: t('form.financial.social.other'),
    event: 'other'
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
    "rsa": "RSA, activity allowance…",
    "unemployment": "unemployment, back-to-work assistance…",
    "or-you-will-tenant": "or you're about to receive it",
    "or-you-will-other": "or they're about to receive it"
  },
  "fr": {
    "you-receive": {
      "tenant": "Vous recevez :",
      "guarantor": "Votre garant touche :",
      "couple": "Votre conjoint touche :",
      "couple-guarantor": "Son garant touche :",
    },
    "rsa": "RSA, prime d’activité…",
    "unemployment": "chômage, aide au retour à l’emploi (ARE)…",
    "or-you-will-tenant": "ou bien vous allez la toucher",
    "or-you-will-other": "ou bien il va la toucher"
  }
}
</i18n>
