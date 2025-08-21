<template>
  <p>{{ t(textKey + '.choose-situation') }}</p>
  <RadioList>
    <RadioListItem :to="here + '/avec-avis'" @click="sendEvent('with-tax')"
      >{{ t(textKey + '.have-a-tax-notice') }}
      <HintText>{{ t('french-or-foreign') }}</HintText>
    </RadioListItem>
    <RadioListItem :to="here + '/sans-avis'" @click="sendEvent('without-tax')"
      >{{ t(textKey + '.have-no-tax-notice') }}
      <HintText>{{ t('tax-examples') }}</HintText>
    </RadioListItem>
  </RadioList>
  <TaxFooter />
</template>

<script setup lang="ts">
import HintText from '@/components/common/HintText.vue'
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import TaxFooter from '@/components/tax/lib/TaxFooter.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useTaxState } from './lib/taxState'

const { t } = useI18n()
const route = useRoute()
const { textKey } = useTaxState()

const here = computed(() => route.path)

const sendEvent = (subcategory: string) => AnalyticsService.selectSituation('tax', subcategory)
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
    }
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
    }
  }
}
</i18n>
