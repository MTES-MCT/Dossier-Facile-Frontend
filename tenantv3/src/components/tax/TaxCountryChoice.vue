<template>
  <p>{{ t('choose-situation') }}</p>
  <BackLinkRow :label="t('you-have-a-tax-notice')" @click="back" />
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
import BackLinkRow from '@/components/common/BackLinkRow.vue'
import HintText from '@/components/common/HintText.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import TaxFooter from '@/components/tax/lib/TaxFooter.vue'
import { useTaxState } from '@/components/tax/lib/taxState'
import { AnalyticsService } from '@/services/AnalyticsService'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const taxState = useTaxState()
const parent = useParentRoute()

const here = computed(() => route.path)

const sendEvent = (subcategory: string) =>
  AnalyticsService.selectSituation2(taxState.category, 'with-tax', subcategory)

function back() {
  AnalyticsService.editSituation(taxState.category, 'with-tax')
  router.push(parent.value)
}
</script>

<i18n>
{
  "en": {
    "choose-situation": "Select the situation that applies to you:",
    "you-have-a-tax-notice": "You have a tax notice",
    "french-notice": "a french tax notice",
    "foreign-notice": "a foreign tax notice",
    "french-examples": "Single, married, civil partnership, divorced, etc.",
    "foreign-examples": "Expatriate"
  },
  "fr": {
    "you-have-a-tax-notice": "Vous avez un avis d’impôt",
    "choose-situation": "Choisissez la situation qui correspond à votre cas :",
    "french-notice": "un avis d’impôt français",
    "foreign-notice": "un avis d’impôt étranger",
    "french-examples": "Célibataire, marié, pacsé, divorcé, …",
    "foreign-examples": "Expatrié"
  }
}
</i18n>
