<template>
  <BackLinkRow
    :label="t('form.financial.retirement-or-pension')"
    :to="grandparent"
    category="pension"
  />
  <BackLinkRow
    :label="t('you-receive.' + textKey)"
    :to="parent"
    category="pension"
    step="invalidite"
  />
  <RadioList :list-items="optionLinks" @analytics="sendEvent" />
  <FinancialFooter disabled />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useSocialOptionLinks } from '../social/lib/useSocialOptionLinks'

const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const { t } = useI18n()
const { category, suffix, textKey } = useFinancialState()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation3(category, 'pension', 'invalidite', subCategory)

const optionLinks = useSocialOptionLinks(here, suffix)
</script>

<i18n>
{
  "en": {
    "you-receive": {
      "tenant": "You receive a disability pension",
      "guarantor": "Your guarantor receives a disability pension",
      "couple": "Your spouse receives a disability pension",
      "couple-guarantor": "Their guarantor receives a disability pension",
    },
    "not-yet": {
      "tenant": "You are not yet receiving a disability pension",
      "guarantor": "Your guarantor is not yet receiving a disability pension",
      "couple": "Your spouse is not yet receiving a disability pension",
      "couple-guarantor": "Their guarantor is not yet receiving a disability pension",
    }
  },
  "fr": {
    "you-receive": {
      "tenant": "Vous touchez une pension d’invalidité",
      "guarantor": "Votre garant touche une pension d’invalidité",
      "couple": "Votre conjoint touche une pension d’invalidité",
      "couple-guarantor": "Son garant touche une pension d’invalidité"
    },
    "not-yet": {
      "tenant": "Vous touchez pas encore de pension d’invalidité",
      "guarantor": "Votre garant ne touche pas encore de pension d’invalidité",
      "couple": "Votre conjoint ne touche pas encore de pension d’invalidité",
      "couple-guarantor": "Son garant ne touche pas encore de pension d’invalidité"
    },
  }
}
</i18n>
