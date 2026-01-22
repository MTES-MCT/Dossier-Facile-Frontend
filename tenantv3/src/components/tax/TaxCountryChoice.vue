<template>
  <p>{{ t(textKey + '.choose-situation') }}</p>
  <BackLinkRow :label="t(textKey + '.have-a-tax-notice')" :to="parent" />
  <RadioList :list-items="optionLinks" @analytics="sendEvent" />
  <TaxFooter />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/tax/lib/TaxBackLinkRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import RadioList, { type optionLink } from '@/components/common/RadioList.vue'
import TaxFooter from '@/components/tax/lib/TaxFooter.vue'
import { useTaxState } from '@/components/tax/lib/taxState'
import { AnalyticsService } from '@/services/AnalyticsService'
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const taxState = useTaxState()
const parent = useParentRoute()
const { textKey } = useTaxState()

const route = useRoute()
const here = computed(() => route.path)

const sendEvent = (subcategory: string) =>
  AnalyticsService.selectSituation2(taxState.category, 'with-tax', subcategory)

const optionLinks: ComputedRef<optionLink[]> = computed(() => [
  {
    to: `${here.value}/francais`,
    title: t('french-notice'),
    event: 'french',
    description: t('french-examples')
  },
  {
    to: `${here.value}/etranger`,
    title: t('foreign-notice'),
    event: 'foreign',
    description: t('foreign-examples')
  }
])
</script>

<i18n>
{
  "en": {
    "french-notice": "a french tax notice",
    "foreign-notice": "a foreign tax notice",
    "french-examples": "Single, married, civil partnership, divorced, etc.",
    "foreign-examples": "Expatriate, third-country national",
    "tenant": {
      "choose-situation": "Select the situation that applies to you:",
      "have-a-tax-notice": "You have a tax notice",
    },
    "guarantor": {
      "choose-situation": "Select the situation of your guarantor:",
      "have-a-tax-notice": "Your guarantor has a tax notice",
    },
    "couple": {
      "choose-situation": "Select the situation of your spouse:",
      "have-a-tax-notice": "Your spouse has a tax notice",
    },
    "couple-guarantor": {
      "choose-situation": "Select the situation of their guarantor:",
      "have-a-tax-notice": "Their guarantor has a tax notice",
    },
  },
  "fr": {
    "french-notice": "un avis d’impôt français",
    "foreign-notice": "un avis d’impôt étranger",
    "french-examples": "Célibataire, marié, pacsé, divorcé, …",
    "foreign-examples": "Expatrié, ressortissant d’un pays tiers",
    "tenant": {
      "have-a-tax-notice": "Vous avez un avis d’impôt",
      "choose-situation": "Choisissez la situation qui correspond à votre cas :",
    },
    "guarantor": {
      "have-a-tax-notice": "Votre garant a un avis d’impôt",
      "choose-situation": "Choisissez la situation de votre garant :",
    },
    "couple": {
      "have-a-tax-notice": "Votre conjoint a un avis d’impôt",
      "choose-situation": "Choisissez la situation de votre conjoint :",
    },
    "couple-guarantor": {
      "have-a-tax-notice": "Son garant a un avis d’impôt",
      "choose-situation": "Choisissez la situation de son garant :",
    },
  }
}
</i18n>
