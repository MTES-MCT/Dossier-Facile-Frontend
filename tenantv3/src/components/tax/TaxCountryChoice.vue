<template>
  <p>{{ t(textKey + '.choose-situation') }}</p>
  <BackLinkRow :label="t(textKey + '.have-a-tax-notice')" :to="parent" />
  <RadioList>
    <RadioListItem :to="here + '/francais'" @click="sendEvent('french')"
      >{{ t('french-notice') }}
      <HintText>{{ t('french-examples') }}</HintText>
    </RadioListItem>
    <RadioListItem :to="here + '/etranger'" @click="sendEvent('foreign')"
      >{{ t('foreign-notice') }}
      <HintText>{{ t('foreign-examples') }}</HintText>
    </RadioListItem>
  </RadioList>
  <TaxFooter />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/tax/lib/TaxBackLinkRow.vue'
import HintText from '@/components/common/HintText.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import TaxFooter from '@/components/tax/lib/TaxFooter.vue'
import { useTaxState } from '@/components/tax/lib/taxState'
import { AnalyticsService } from '@/services/AnalyticsService'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const taxState = useTaxState()
const parent = useParentRoute()
const { textKey } = useTaxState()

const here = computed(() => route.path)

const sendEvent = (subcategory: string) =>
  AnalyticsService.selectSituation2(taxState.category, 'with-tax', subcategory)
</script>

<i18n>
{
  "en": {
    "french-notice": "a french tax notice",
    "foreign-notice": "a foreign tax notice",
    "french-examples": "Single, married, civil partnership, divorced, etc.",
    "foreign-examples": "Expatriate",
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
    }
  },
  "fr": {
    "french-notice": "un avis d’impôt français",
    "foreign-notice": "un avis d’impôt étranger",
    "french-examples": "Célibataire, marié, pacsé, divorcé, …",
    "foreign-examples": "Expatrié",
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
    }
  }
}
</i18n>
