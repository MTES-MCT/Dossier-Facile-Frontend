<template>
  <p>{{ t(textKey + '.choose-situation') }}</p>
  <RadioList :list-items="optionLinks" @analytics="sendEvent" />
  <TaxFooter />
</template>

<script setup lang="ts">
import RadioList, { type OptionLink } from '@/components/common/RadioList.vue'
import TaxFooter from '@/components/tax/lib/TaxFooter.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useTaxState } from './lib/taxState'

const { t } = useI18n()
const route = useRoute()
const { textKey } = useTaxState()

const here = computed(() => route.path)

const sendEvent = (subcategory: string) => AnalyticsService.selectSituation('tax', subcategory)

const optionLinks: ComputedRef<OptionLink[]> = computed(() => [
  {
    to: `${here.value}/avec-avis`,
    title: t(textKey + '.have-a-tax-notice'),
    event: 'with-tax',
    description: t('french-or-foreign')
  },
  {
    to: `${here.value}/sans-avis`,
    title: t(textKey + '.have-no-tax-notice'),
    event: 'without-tax',
    description: t('tax-examples')
  }
])
</script>

<i18n>
{
  "en": {
    "french-or-foreign": "French or foreign",
    "tax-exemples": "Student, dependent on parents, first tax return…",
    "tenant": {
      "choose-situation": "Select the situation that applies to you:",
      "have-a-tax-notice": "You have a tax notice",
      "have-no-tax-notice": "You have no tax notice",
    },
    "guarantor": {
      "choose-situation": "Select the situation of your guarantor:",
      "have-a-tax-notice": "Your guarantor has a tax notice",
      "have-no-tax-notice": "Your guarantor doesn't have a tax notice",
    },
    "couple": {
      "choose-situation": "Select the situation of your spouse:",
      "have-a-tax-notice": "Your spouse has a tax notice",
      "have-no-tax-notice": "Your spouse doesn't have a tax notice",
    },
    "couple-guarantor": {
      "choose-situation": "Select the situation of their guarantor:",
      "have-a-tax-notice": "Their guarantor has a tax notice",
      "have-no-tax-notice": "Their guarantor doesn't have a tax notice",
    },
  },
  "fr": {
    "french-or-foreign": "Français ou étranger",
    "tax-examples": "Étudiant, à charge des parents, première déclaration…",
    "tenant": {
      "choose-situation": "Choisissez la situation qui correspond à votre cas :",
      "have-a-tax-notice": "Vous avez un avis d’impôt",
      "have-no-tax-notice": "Vous n’avez pas d’avis d’impôt",
    },
    "guarantor": {
      "choose-situation": "Choisissez la situation de votre garant :",
      "have-a-tax-notice": "Votre garant a un avis d’impôt",
      "have-no-tax-notice": "Votre garant n’a pas d’avis d’impôt",
    },
    "couple": {
      "choose-situation": "Choisissez la situation de votre conjoint :",
      "have-a-tax-notice": "Votre conjoint a un avis d’impôt",
      "have-no-tax-notice": "Votre conjoint n’a pas d’avis d’impôt",
    },
    "couple-guarantor": {
      "choose-situation": "Choisissez la situation de son garant :",
      "have-a-tax-notice": "Son garant a un avis d’impôt",
      "have-no-tax-notice": "Son garant n’a pas d’avis d’impôt",
    }
  }
}
</i18n>
