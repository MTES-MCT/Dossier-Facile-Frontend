<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="grandparent" category="social" />
  <BackLinkRow
    :label="t('form.financial.you-receive.' + textKey, [t('form.financial.social.aah')])"
    :to="parent"
    category="social"
    step="aah"
  />
  <RadioList>
    <RadioListItem :to="here + '/plus-3-mois'" @click="sendEvent('plus-3-mois')">{{
      t('form.financial.more-3-months')
    }}</RadioListItem>
    <RadioListItem :to="here + '/moins-3-mois'" @click="sendEvent('moins-3-mois')">{{
      t('form.financial.less-3-months')
    }}</RadioListItem>
    <RadioListItem :to="here + '/pas-encore'" @click="sendEvent('pas-encore')">{{
      t('not-yet-' + suffix)
    }}</RadioListItem>
  </RadioList>
  <FinancialFooter disabled />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'
import { AnalyticsService } from '@/services/AnalyticsService'

const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const { t } = useI18n()
const { category, suffix, textKey } = useFinancialState()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation3(category, 'social', 'caf', subCategory)
</script>

<i18n>
{
  "en": {
    "not-yet-tenant": "You're not yet receiving AAH",
    "not-yet-other": "They're not yet receiving AAH",
  },
  "fr": {
    "not-yet-tenant": "Vous ne touchez pas encore l’AAH",
    "not-yet-other": "Ne touche pas encore l’AAH",
  }
}
</i18n>
