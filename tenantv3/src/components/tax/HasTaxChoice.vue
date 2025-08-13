<template>
  <p>{{ t('choose-situation') }}</p>
  <RadioList>
    <RadioListItem :to="here + '/avec-avis'" @click="sendEvent('with-tax')"
      >{{ t('you-have-a-tax-notice') }}
      <HintText>{{ t('french-or-foreign') }}</HintText>
    </RadioListItem>
    <RadioListItem :to="here + '/sans-avis'" @click="sendEvent('without-tax')"
      >{{ t('you-have-no-tax-notice') }}
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

const { t } = useI18n()
const route = useRoute()

const here = computed(() => route.path)

const sendEvent = (subcategory: string) => AnalyticsService.selectSituation('tax', subcategory)
</script>

<i18n>
{
  "en": {
    "choose-situation": "Select the situation that applies to you:",
    "you-have-a-tax-notice": "You have a tax notice",
    "you-have-no-tax-notice": "You have no tax notice",
    "french-or-foreign": "French or foreign",
    "tax-exemples": "Student, dependent on parents, first tax return…"
  },
  "fr": {
    "choose-situation": "Choisissez la situation qui correspond à votre cas :",
    "you-have-a-tax-notice": "Vous avez un avis d’impôt",
    "you-have-no-tax-notice": "Vous n’avez pas d’avis d’impôt",
    "french-or-foreign": "Français ou étranger",
    "tax-examples": "Étudiant, à charge des parents, première déclaration…"
  }
}
</i18n>
