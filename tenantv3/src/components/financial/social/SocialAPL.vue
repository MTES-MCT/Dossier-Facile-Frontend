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
import RadioList from '@/components/common/RadioList.vue'
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useSocialOptionLinks } from './lib/useSocialOptionLinks'

const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const { t } = useI18n()
const { category, suffix, textKey } = useFinancialState()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation3(category, 'social', 'apl', subCategory)

const optionLinks = useSocialOptionLinks(here, suffix)
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
