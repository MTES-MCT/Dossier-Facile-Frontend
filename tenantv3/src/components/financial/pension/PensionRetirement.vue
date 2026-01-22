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
    step="retraite"
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
  AnalyticsService.selectSituation3(category, 'pension', 'retraite', subCategory)

const optionLinks: ComputedRef<OptionLink[]> = computed(() => [
  {
    to: `${here.value}/bulletin`,
    title: t('pension-statement.' + textKey),
    event: 'bulletin',
    description: 'Info retraite, AGIRC-ARCO, Carsat'
  },
  {
    to: `${here.value}/pas-de-bulletin`,
    title: t('no-statement.' + textKey),
    event: 'pas-de-bulletin'
  }
])
</script>

<i18n>
{
  "en": {
    "you-receive": {
      "tenant": "You receive a pension",
      "guarantor": "Your guarantor receives a pension",
      "couple": "Your spouse receives a pension",
      "couple-guarantor": "Their guarantor receives a pension",
    },
    "pension-statement": {
      "tenant": "You have a pension statement",
      "guarantor": "Your guarantor has a pension statement",
      "couple": "Your spouse has a pension statement",
      "couple-guarantor": "Their guarantor has a pension statement",
    },
    "no-statement": {
      "tenant": "You don't have a pension statement",
      "guarantor": "Your guarantor has no pension statement",
      "couple": "Your spouse has no pension statement",
      "couple-guarantor": "Their guarantor has no pension statement",
    },
  },
  "fr": {
    "you-receive": {
      "tenant": "Vous touchez une retraite",
      "guarantor": "Votre garant touche une retraite",
      "couple": "Votre conjoint touche une retraite",
      "couple-guarantor": "Son garant touche une retraite",
    },
    "pension-statement": {
      "tenant": "Vous avez un bulletin de pension",
      "guarantor": "Votre garant a un bulletin de pension",
      "couple": "Votre conjoint a un bulletin de pension",
      "couple-guarantor": "Son garant a un bulletin de pension",
    },
    "no-statement": {
      "tenant": "Vous n’avez pas de bulletin de pension",
      "guarantor": "Votre garant n’a pas de bulletin de pension",
      "couple": "Votre conjoint n’a pas de bulletin de pension",
      "couple-guarantor": "Son garant n’a pas de bulletin de pension",
    }
  }
}
</i18n>
