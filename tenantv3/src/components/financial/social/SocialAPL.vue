<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="grandparent" category="social" />
  <BackLinkRow
    :label="t('form.financial.you-receive.' + textKey, [t('form.financial.social.apl')])"
    :to="parent"
    category="social"
    step="apl"
  />
  <RadioList :list-items="optionLinks" @analytics="sendEvent" />
  <FinancialFooter disabled />
</template>

<script setup lang="ts">
import RadioList, { type optionLink } from '@/components/common/RadioList.vue'
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useRoute } from 'vue-router'
import { computed, type ComputedRef } from 'vue'
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

const optionLinks: ComputedRef<optionLink[]> = computed(() => [
  {
    to: `${here.value}/plus-3-mois`,
    title: t('form.financial.more-3-months'),
    event: 'plus-3-mois'
  },
  {
    to: `${here.value}/moins-3-mois`,
    title: t('form.financial.less-3-months'),
    event: 'moins-3-mois'
  },
  {
    to: `${here.value}/pas-encore`,
    title: t('not-yet-' + suffix),
    event: 'pas-encore'
  }
])
</script>

<i18n>
{
  "en": {
    "not-yet-tenant": "You're not yet receiving APL",
    "not-yet-other": "They're not yet receiving APL",
  },
  "fr": {
    "not-yet-tenant": "Vous ne touchez pas encore l’APL",
    "not-yet-other": "Ne touche pas encore l’APL",
  }
}
</i18n>
